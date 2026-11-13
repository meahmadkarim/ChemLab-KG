import * as database from "./server-database";

import { promises as fs } from "fs";
import path from "path";
import type { SessionUser } from "@/features/auth/server-session";
import type { StudentLabReport, LabReportSaveInput, LabReportStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const REPORTS_FILE = path.join(DATA_DIR, "student-lab-reports.json");

// Serialize file writes to prevent concurrent mutation loss
let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function readAllLocal(): Promise<Record<string, StudentLabReport>> {
  try {
    const raw = await fs.readFile(REPORTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, StudentLabReport>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeAllLocal(all: Record<string, StudentLabReport>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${REPORTS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(all, null, 2), "utf8");
  await fs.rename(tmp, REPORTS_FILE);
}

function makeReportKey(userId: string, experimentSlug: string, assignmentId?: string | null): string {
  return `${userId}:${experimentSlug}:${assignmentId || "personal"}`;
}

export async function getStudentLabReport(
  user: SessionUser,
  experimentSlug: string,
  assignmentId?: string | null
): Promise<StudentLabReport | null> {
  if (!user.isDemo) return database.readReport(user, experimentSlug, assignmentId);
  const key = makeReportKey(user.id, experimentSlug, assignmentId);
  

  // 2. Persistent local store fallback
  const all = await readAllLocal();
  return all[key] ?? null;
}

export async function getStudentAllReports(
  user: SessionUser
): Promise<StudentLabReport[]> {
  if (!user.isDemo) return database.listReports(user);
  const all = await readAllLocal();
  const reports = Object.values(all).filter((r) => r.userId === user.id);

  

  return reports.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function saveStudentLabReport(
  user: SessionUser,
  input: LabReportSaveInput
): Promise<StudentLabReport> {
  if (!user.isDemo) return database.saveReport(user, input);
  const now = new Date().toISOString();
  const key = makeReportKey(user.id, input.experimentSlug, input.assignmentId);

  const existing = await getStudentLabReport(user, input.experimentSlug, input.assignmentId);

  // Don't allow students to edit if already reviewed unless status explicitly changed
  const currentStatus: LabReportStatus = existing?.status === "reviewed" ? "reviewed" : (input.status || existing?.status || "draft");

  const reportToSave: StudentLabReport = {
    id: existing?.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`),
    userId: user.id,
    userDisplayName: user.name,
    studentName: user.name,
    experimentSlug: input.experimentSlug,
    assignmentId: input.assignmentId || null,
    mode: input.mode || "video_observation",
    aim: input.aim ?? existing?.aim ?? "",
    researchQuestion: input.researchQuestion ?? existing?.researchQuestion ?? "",
    hypothesis: input.hypothesis ?? existing?.hypothesis ?? "",
    procedureSteps: input.procedureSteps ?? existing?.procedureSteps ?? [],
    observations: input.observations ?? existing?.observations ?? "",
    results: input.results ?? existing?.results ?? "",
    conclusion: input.conclusion ?? existing?.conclusion ?? "",
    status: currentStatus,
    teacherFeedback: existing?.teacherFeedback || "",
    reviewedAt: existing?.reviewedAt,
    reviewedBy: existing?.reviewedBy,
    reviewedByName: existing?.reviewedByName,
    submittedAt: currentStatus === "submitted" && !existing?.submittedAt ? now : existing?.submittedAt,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  

  // 2. Persistent local store write
  await enqueue(async () => {
    const all = await readAllLocal();
    all[key] = reportToSave;
    await writeAllLocal(all);
  });

  return reportToSave;
}

export async function submitStudentLabReport(
  user: SessionUser,
  experimentSlug: string,
  assignmentId?: string | null
): Promise<StudentLabReport> {
  if (!user.isDemo) return database.reportStatus(user, experimentSlug, assignmentId, "submitted");
  const existing = await getStudentLabReport(user, experimentSlug, assignmentId);
  const now = new Date().toISOString();

  const input: LabReportSaveInput = {
    experimentSlug,
    assignmentId,
    mode: existing?.mode || "video_observation",
    aim: existing?.aim || "",
    researchQuestion: existing?.researchQuestion || "",
    hypothesis: existing?.hypothesis || "",
    procedureSteps: existing?.procedureSteps || [],
    observations: existing?.observations || "",
    results: existing?.results || "",
    conclusion: existing?.conclusion || "",
    status: "submitted",
  };

  const saved = await saveStudentLabReport(user, input);
  saved.submittedAt = now;
  return saved;
}

export async function getTeacherClassroomReports(
  teacher: SessionUser,
  assignmentId?: string | null
): Promise<StudentLabReport[]> {
  if (!teacher.isDemo) return database.listReports(teacher, true, assignmentId);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  // Read from local persistent store
  const all = await readAllLocal();
  let reports = Object.values(all).filter((r) => r.userId === "usr-student-demo" && (r.status === "submitted" || r.status === "reviewed"));

  if (assignmentId) {
    reports = reports.filter((r) => r.assignmentId === assignmentId);
  }
  

  return reports;
}

export async function addTeacherReportReview(
  teacher: SessionUser,
  reportId: string,
  feedbackText: string
): Promise<StudentLabReport> {
  if (!teacher.isDemo) return database.reviewReport(teacher, reportId, feedbackText);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const now = new Date().toISOString();
  const all = await readAllLocal();
  const foundEntry = Object.entries(all).find(([, r]) => r.id === reportId && r.userId === "usr-student-demo");

  if (!foundEntry) {
    throw new Error("Lab report not found.");
  }

  const [key, report] = foundEntry;
  report.teacherFeedback = feedbackText;
  report.status = "reviewed";
  report.reviewedAt = now;
  report.reviewedBy = teacher.id;
  report.reviewedByName = teacher.name;
  report.updatedAt = now;

  await enqueue(async () => {
    all[key] = report;
    await writeAllLocal(all);
  });

  

  return report;
}

export async function deleteStudentLabReport(
  user: SessionUser,
  experimentSlug: string,
  assignmentId?: string | null
): Promise<boolean> {
  if (!user.isDemo) return database.deleteReport(user, experimentSlug, assignmentId);
  const existing = await getStudentLabReport(user, experimentSlug, assignmentId);
  if (!existing) return false;

  // Cannot delete reviewed reports
  if (existing.status === "reviewed") {
    throw new Error("Cannot delete a report that has already been reviewed by your teacher.");
  }

  const key = makeReportKey(user.id, experimentSlug, assignmentId);

  // 1. Delete from local store
  await enqueue(async () => {
    const all = await readAllLocal();
    if (all[key]) {
      delete all[key];
      await writeAllLocal(all);
    }
  });
  

  return true;
}

export async function withdrawStudentLabReport(
  user: SessionUser,
  experimentSlug: string,
  assignmentId?: string | null
): Promise<StudentLabReport> {
  if (!user.isDemo) return database.reportStatus(user, experimentSlug, assignmentId, "draft");
  const existing = await getStudentLabReport(user, experimentSlug, assignmentId);
  if (!existing) {
    throw new Error("No submitted report found to withdraw.");
  }

  if (existing.status === "reviewed") {
    throw new Error("Cannot withdraw a report that has already been reviewed by your teacher.");
  }

  const now = new Date().toISOString();
  const key = makeReportKey(user.id, experimentSlug, assignmentId);

  const updated: StudentLabReport = {
    ...existing,
    status: "draft",
    updatedAt: now,
  };

  // Update in local store
  await enqueue(async () => {
    const all = await readAllLocal();
    all[key] = updated;
    await writeAllLocal(all);
  });
  

  return updated;
}
