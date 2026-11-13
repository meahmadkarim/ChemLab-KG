import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import {
  getTeacherNotebook,
  getAllTeacherNotebooks,
  saveTeacherNotebook,
  deleteTeacherNotebook,
} from "@/features/notebook/server-teacher-notebook";
import type { LabProcedureStep, LabReportMode } from "@/features/notebook/types";

const procedureStepSchema = z.object({
  id: z.string(),
  stepNumber: z.number().int().min(1),
  text: z.string().max(2000),
  source: z.enum(["video_observation", "personally_performed"]),
});

const saveTeacherNotebookSchema = z.object({
  experimentSlug: z.string().min(1).max(200),
  mode: z.enum(["video_observation", "supervised_lab"]).optional(),
  aim: z.string().max(5000).default(""),
  researchQuestion: z.string().max(2000).default(""),
  hypothesis: z.string().max(5000).default(""),
  procedureSteps: z.array(procedureStepSchema).max(50).default([]),
  expectedObservations: z.string().max(10000).default(""),
  actualObservations: z.string().max(10000).default(""),
  measurements: z.string().max(5000).default(""),
  explanatoryNotes: z.string().max(10000).default(""),
  results: z.string().max(10000).default(""),
  conclusion: z.string().max(10000).default(""),
  teachingGuidance: z.string().max(10000).default(""),
});

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (user.role !== "teacher" && user.role !== "admin") {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const all = searchParams.get("all");

  try {
    if (all === "true" || !slug) {
      const notebooks = await getAllTeacherNotebooks(user);
      return NextResponse.json({ ok: true, notebooks });
    }

    const data = await getTeacherNotebook(user, slug);
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    console.error("[Teacher Notebook API] GET Error:", err);
    return NextResponse.json({ error: "Failed to load teacher notebook." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (user.role !== "teacher" && user.role !== "admin") {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  try {
    const rawBody = await request.json();
    const parsed = saveTeacherNotebookSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid notebook data.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const saved = await saveTeacherNotebook(user, {
      ...parsed.data,
      mode: (parsed.data.mode || "video_observation") as LabReportMode,
      procedureSteps: parsed.data.procedureSteps as LabProcedureStep[],
    });

    return NextResponse.json({ ok: true, notebook: saved });
  } catch (err) {
    console.error("[Teacher Notebook API] PUT Error:", err);
    return NextResponse.json({ error: "Failed to save teacher notebook." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (user.role !== "teacher" && user.role !== "admin") {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Experiment slug is required." }, { status: 400 });
  }

  try {
    const deleted = await deleteTeacherNotebook(user, slug);
    return NextResponse.json({ ok: true, deleted, message: "Teacher notebook draft and associated shares deleted." });
  } catch (err: unknown) {
    console.error("[Teacher Notebook API] DELETE Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete teacher notebook." },
      { status: 500 }
    );
  }
}
