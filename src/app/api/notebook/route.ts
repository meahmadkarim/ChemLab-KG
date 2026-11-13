import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { getStudentLabReport, getStudentAllReports, saveStudentLabReport, deleteStudentLabReport, withdrawStudentLabReport } from "@/features/notebook/server-notebook";
import type { LabReportMode } from "@/features/notebook/types";

const procedureStepSchema = z.object({
  id: z.string(),
  stepNumber: z.number().int().min(1),
  text: z.string().max(2000),
  source: z.enum(["video_observation", "personally_performed"]),
});

const saveReportSchema = z.object({
  experimentSlug: z.string().min(1).max(200),
  assignmentId: z.string().uuid().nullable().optional(),
  mode: z.enum(["video_observation", "supervised_lab"]),
  aim: z.string().max(3000).default(""),
  researchQuestion: z.string().max(1000).default(""),
  hypothesis: z.string().max(3000).default(""),
  procedureSteps: z.array(procedureStepSchema).max(50).default([]),
  observations: z.string().max(10000).default(""),
  results: z.string().max(10000).default(""),
  conclusion: z.string().max(10000).default(""),
  status: z.enum(["draft", "submitted"]).optional(),
});

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const assignmentId = searchParams.get("assignmentId");

  try {
    if (!slug) {
      const reports = await getStudentAllReports(user);
      return NextResponse.json({ ok: true, reports });
    }

    const report = await getStudentLabReport(user, slug, assignmentId);
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    console.error("[Notebook API] Failed to fetch report:", err);
    return NextResponse.json({ error: "Failed to load laboratory report." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parsed = saveReportSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid report data.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const saved = await saveStudentLabReport(user, {
      ...parsed.data,
      mode: parsed.data.mode as LabReportMode,
    });

    return NextResponse.json({ ok: true, report: saved });
  } catch (err) {
    console.error("[Notebook API] Failed to save report:", err);
    return NextResponse.json({ error: "Failed to save laboratory report." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const assignmentId = searchParams.get("assignmentId");
  const action = searchParams.get("action"); // "withdraw" or "delete"

  if (!slug) {
    return NextResponse.json({ error: "Experiment slug is required." }, { status: 400 });
  }

  try {
    if (action === "withdraw") {
      const updated = await withdrawStudentLabReport(user, slug, assignmentId);
      return NextResponse.json({ ok: true, report: updated, message: "Report withdrawn to draft status." });
    }

    const deleted = await deleteStudentLabReport(user, slug, assignmentId);
    return NextResponse.json({ ok: true, deleted, message: "Draft successfully deleted." });
  } catch (err: unknown) {
    console.error("[Notebook API] DELETE error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete or withdraw report." },
      { status: 400 }
    );
  }
}
