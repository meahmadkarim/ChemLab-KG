import * as database from "./server-database";

import { promises as fs } from "fs";
import path from "path";
import type { SessionUser } from "@/features/auth/server-session";
import { DEFAULT_CLASSROOMS } from "@/features/progress/learning-state";
import type {
  TeacherLabNotebook,
  TeacherNotebookShare,
  TeacherNotebookSaveInput,
  ShareWithClassInput,
  } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const TEACHER_NOTEBOOKS_FILE = path.join(DATA_DIR, "teacher-lab-notebooks.json");
const TEACHER_SHARES_FILE = path.join(DATA_DIR, "teacher-notebook-shares.json");

let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function readAllTeacherNotebooks(): Promise<Record<string, TeacherLabNotebook>> {
  try {
    const raw = await fs.readFile(TEACHER_NOTEBOOKS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeAllTeacherNotebooks(data: Record<string, TeacherLabNotebook>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${TEACHER_NOTEBOOKS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, TEACHER_NOTEBOOKS_FILE);
}

async function readAllShares(): Promise<Record<string, TeacherNotebookShare>> {
  try {
    const raw = await fs.readFile(TEACHER_SHARES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeAllShares(data: Record<string, TeacherNotebookShare>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${TEACHER_SHARES_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, TEACHER_SHARES_FILE);
}

function makeNotebookKey(teacherId: string, slug: string): string {
  return `${teacherId}:${slug}`;
}

function makeShareKey(notebookId: string, classroomId: string): string {
  return `${notebookId}:${classroomId}`;
}

function getClassroomName(classroomId: string): string {
  const found = DEFAULT_CLASSROOMS.find((c) => c.id === classroomId);
  return found?.name || `Classroom ${classroomId}`;
}

/**
 * 1. Get or create a teacher's private notebook draft + existing classroom shares
 */
export async function getTeacherNotebook(
  teacher: SessionUser,
  experimentSlug: string
): Promise<{ notebook: TeacherLabNotebook | null; shares: TeacherNotebookShare[] }> {
  if (!teacher.isDemo) return database.readNotebook(teacher, experimentSlug);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const key = makeNotebookKey(teacher.id, experimentSlug);
  let notebook: TeacherLabNotebook | null = null;


  // 2. Local store fallback
  if (!notebook) {
    const all = await readAllTeacherNotebooks();
    notebook = all[key] || null;
  }

  // Load shares
  const allShares = await readAllShares();
  const shares = Object.values(allShares).filter(
    (s) => s.teacherId === teacher.id && s.experimentSlug === experimentSlug
  );



  return { notebook, shares };
}

/**
 * 2. Get all saved notebooks for teacher resources page
 */
export async function getAllTeacherNotebooks(
  teacher: SessionUser
): Promise<Array<TeacherLabNotebook & { shares: TeacherNotebookShare[] }>> {
  if (!teacher.isDemo) return database.listNotebooks(teacher);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const all = await readAllTeacherNotebooks();
  const notebooks = Object.values(all).filter((n) => n.teacherId === teacher.id);



  const allShares = await readAllShares();
  const result = notebooks.map((nb) => {
    const shares = Object.values(allShares).filter((s) => s.notebookId === nb.id);
    return { ...nb, shares };
  });

  return result.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * 3. Save or update teacher private draft
 */
export async function saveTeacherNotebook(
  teacher: SessionUser,
  input: TeacherNotebookSaveInput
): Promise<TeacherLabNotebook> {
  if (!teacher.isDemo) return database.saveNotebook(teacher, input);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const now = new Date().toISOString();
  const key = makeNotebookKey(teacher.id, input.experimentSlug);
  const { notebook: existing } = await getTeacherNotebook(teacher, input.experimentSlug);

  const notebookToSave: TeacherLabNotebook = {
    id: existing?.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `tnb-${Date.now()}`),
    teacherId: teacher.id,
    teacherName: teacher.name,
    experimentSlug: input.experimentSlug,
    mode: input.mode || existing?.mode || "video_observation",
    aim: input.aim ?? existing?.aim ?? "",
    researchQuestion: input.researchQuestion ?? existing?.researchQuestion ?? "",
    hypothesis: input.hypothesis ?? existing?.hypothesis ?? "",
    procedureSteps: input.procedureSteps ?? existing?.procedureSteps ?? [],
    expectedObservations: input.expectedObservations ?? existing?.expectedObservations ?? "",
    actualObservations: input.actualObservations ?? existing?.actualObservations ?? "",
    measurements: input.measurements ?? existing?.measurements ?? "",
    explanatoryNotes: input.explanatoryNotes ?? existing?.explanatoryNotes ?? "",
    results: input.results ?? existing?.results ?? "",
    conclusion: input.conclusion ?? existing?.conclusion ?? "",
    teachingGuidance: input.teachingGuidance ?? existing?.teachingGuidance ?? "",
    status: existing?.status || "draft",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };


  // 2. Local persistent write
  await enqueue(async () => {
    const all = await readAllTeacherNotebooks();
    all[key] = notebookToSave;
    await writeAllTeacherNotebooks(all);
  });

  return notebookToSave;
}

/**
 * 4. Share selected sections with classrooms (creates an immutable published snapshot)
 */
export async function shareNotebookWithClassrooms(
  teacher: SessionUser,
  input: ShareWithClassInput
): Promise<{ shares: TeacherNotebookShare[]; notebook: TeacherLabNotebook }> {
  if (!teacher.isDemo) return database.shareNotebook(teacher, input);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  if (input.classroomIds.length === 0) {
    throw new Error("At least one classroom must be selected.");
  }

  if (input.sharedSections.length === 0) {
    throw new Error("At least one section must be selected for sharing.");
  }

  // Ensure draft is saved
  let { notebook } = await getTeacherNotebook(teacher, input.experimentSlug);
  if (!notebook) {
    notebook = await saveTeacherNotebook(teacher, { experimentSlug: input.experimentSlug });
  }

  const now = new Date().toISOString();

  // Create immutable snapshot of ONLY the selected sections (no private teaching guidance unless explicitly included)
  const publishedSnapshot = {
    aim: input.sharedSections.includes("aim_hypothesis") ? notebook.aim : "",
    researchQuestion: input.sharedSections.includes("aim_hypothesis") ? notebook.researchQuestion : "",
    hypothesis: input.sharedSections.includes("aim_hypothesis") ? notebook.hypothesis : "",
    procedureSteps: input.sharedSections.includes("procedure") ? notebook.procedureSteps : [],
    expectedObservations: input.sharedSections.includes("observations") ? notebook.expectedObservations : "",
    actualObservations: input.sharedSections.includes("observations") ? notebook.actualObservations : "",
    measurements: input.sharedSections.includes("observations") ? notebook.measurements : "",
    explanatoryNotes: input.sharedSections.includes("observations") ? notebook.explanatoryNotes : "",
    results: input.sharedSections.includes("conclusion") ? notebook.results : "",
    conclusion: input.sharedSections.includes("conclusion") ? notebook.conclusion : "",
    teachingGuidance: "", // strictly private by default
  };

  const allShares = await readAllShares();
  const createdOrUpdatedShares: TeacherNotebookShare[] = [];

  for (const classroomId of input.classroomIds) {
    const shareKey = makeShareKey(notebook.id, classroomId);
    const existingShare = allShares[shareKey];

    const shareRecord: TeacherNotebookShare = {
      id: existingShare?.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `tns-${Date.now()}-${classroomId}`),
      notebookId: notebook.id,
      teacherId: teacher.id,
      teacherName: teacher.name,
      classroomId,
      classroomName: getClassroomName(classroomId),
      experimentSlug: input.experimentSlug,
      sharedSections: input.sharedSections,
      publishedSnapshot,
      version: (existingShare?.version || 0) + 1,
      publishedAt: existingShare?.publishedAt || now,
      updatedAt: now,
    };

    allShares[shareKey] = shareRecord;
    createdOrUpdatedShares.push(shareRecord);


  }

  // Update notebook status to "published"
  notebook.status = "published";
  notebook.updatedAt = now;

  await enqueue(async () => {
    await writeAllShares(allShares);
    const allNb = await readAllTeacherNotebooks();
    allNb[makeNotebookKey(teacher.id, input.experimentSlug)] = notebook!;
    await writeAllTeacherNotebooks(allNb);
  });

  return { shares: createdOrUpdatedShares, notebook };
}

/**
 * 5. Revoke classroom share
 */
export async function revokeClassroomShare(
  teacher: SessionUser,
  experimentSlug: string,
  classroomId: string
): Promise<boolean> {
  if (!teacher.isDemo) return database.revokeShares(teacher, experimentSlug, classroomId);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const { notebook } = await getTeacherNotebook(teacher, experimentSlug);
  if (!notebook) return false;

  const shareKey = makeShareKey(notebook.id, classroomId);
  const allShares = await readAllShares();

  if (!allShares[shareKey]) return false;

  delete allShares[shareKey];

  // If no more classrooms share this notebook, revert status to draft
  const remaining = Object.values(allShares).filter((s) => s.notebookId === notebook.id);
  if (remaining.length === 0) {
    notebook.status = "draft";
    const allNb = await readAllTeacherNotebooks();
    allNb[makeNotebookKey(teacher.id, experimentSlug)] = notebook;
    await writeAllTeacherNotebooks(allNb);
  }

  await enqueue(async () => {
    await writeAllShares(allShares);
  });



  return true;
}

/**
 * 5b. Revoke all classroom shares for an experiment
 */
export async function revokeAllClassroomShares(
  teacher: SessionUser,
  experimentSlug: string
): Promise<boolean> {
  if (!teacher.isDemo) return database.revokeShares(teacher, experimentSlug);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const { notebook, shares } = await getTeacherNotebook(teacher, experimentSlug);
  if (!notebook) return false;

  const allShares = await readAllShares();
  let modified = false;

  for (const share of shares) {
    const shareKey = makeShareKey(notebook.id, share.classroomId);
    if (allShares[shareKey]) {
      delete allShares[shareKey];
      modified = true;
    }
  }

  notebook.status = "draft";
  const allNb = await readAllTeacherNotebooks();
  allNb[makeNotebookKey(teacher.id, experimentSlug)] = notebook;

  await enqueue(async () => {
    if (modified) {
      await writeAllShares(allShares);
    }
    await writeAllTeacherNotebooks(allNb);
  });



  return true;
}

/**
 * 5c. Delete a teacher's private notebook draft and any shares
 */
export async function deleteTeacherNotebook(
  teacher: SessionUser,
  experimentSlug: string
): Promise<boolean> {
  if (!teacher.isDemo) return database.deleteNotebook(teacher, experimentSlug);
  if (teacher.role !== "teacher" && teacher.role !== "admin") {
    throw new Error("Teacher authorization required.");
  }

  const key = makeNotebookKey(teacher.id, experimentSlug);
  const { notebook, shares } = await getTeacherNotebook(teacher, experimentSlug);
  if (!notebook) return false;

  await enqueue(async () => {
    // Delete notebook
    const allNb = await readAllTeacherNotebooks();
    if (allNb[key]) {
      delete allNb[key];
      await writeAllTeacherNotebooks(allNb);
    }

    // Delete shares
    const allShares = await readAllShares();
    let modified = false;
    for (const share of shares) {
      const shareKey = makeShareKey(notebook.id, share.classroomId);
      if (allShares[shareKey]) {
        delete allShares[shareKey];
        modified = true;
      }
    }
    if (modified) {
      await writeAllShares(allShares);
    }
  });



  return true;
}

/**
 * 6. Student access: Get published teacher notes for an experiment
 * Enforces enrollment authorization: student must be in the classroom!
 */
export async function getStudentAccessibleTeacherNotes(
  student: SessionUser,
  experimentSlug: string,
  classroomId?: string | null
): Promise<TeacherNotebookShare[]> {
  if (!student.isDemo) return database.readShares(student, experimentSlug, classroomId);
  const allShares = await readAllShares();
  let shares = Object.values(allShares).filter((s) => s.teacherId === "usr-teacher-demo" && s.experimentSlug === experimentSlug);

  // If classroomId specified, filter by it
  if (classroomId) {
    shares = shares.filter((s) => s.classroomId === classroomId);
  }


  return shares;
}

/**
 * 7. Student access: Get all published notes for a specific classroom (or all classrooms)
 */
export async function getStudentClassroomSharedNotes(
  student: SessionUser,
  classroomId?: string | null
): Promise<TeacherNotebookShare[]> {
  if (!student.isDemo) return database.readShares(student, undefined, classroomId);
  const allShares = await readAllShares();
  let shares = Object.values(allShares).filter(s => s.teacherId === "usr-teacher-demo");
  if (classroomId && classroomId !== "all") {
    shares = shares.filter((s) => s.classroomId === classroomId);
  }
  return shares.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
