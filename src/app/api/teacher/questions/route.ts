import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import {
  getTopicQuestionBank,
  saveQuestionBankItem,
  archiveQuestionBankItem,
} from "@/features/questions/server-questions";
import type { TopicId } from "@/features/experiments/types";

const saveQuestionSchema = z.object({
  id: z.string().optional(),
  topicId: z.string().min(1),
  experimentSlug: z.string().min(1),
  promptText: z.string().min(3).max(2000),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1).max(1000),
        isCorrect: z.boolean(),
        explanation: z.string().max(2000).default(""),
      })
    )
    .min(2)
    .max(6),
});

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if ((user.role !== "teacher" && user.role !== "admin") || user.teacherStatus === "pending_approval") {
    return NextResponse.json({ error: "Approved teacher authorization required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) {
    return NextResponse.json({ error: "topicId is required." }, { status: 400 });
  }

  try {
    const questions = await getTopicQuestionBank(topicId, user);
    return NextResponse.json({ ok: true, questions });
  } catch (err) {
    console.error("[Teacher Questions API] GET Error:", err);
    return NextResponse.json({ error: "Failed to load question bank." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if ((user.role !== "teacher" && user.role !== "admin") || user.teacherStatus === "pending_approval") {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  if (!user.isDemo) return NextResponse.json({ error: "Personal question-bank editing is not yet available for real accounts. Administrators can edit published quizzes in the content studio." }, { status: 503 });

  try {
    const rawBody = await request.json();
    const parsed = saveQuestionSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid question data.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const saved = await saveQuestionBankItem(user, {
      ...parsed.data,
      topicId: parsed.data.topicId as TopicId,
    });

    return NextResponse.json({ ok: true, question: saved });
  } catch (err: unknown) {
    console.error("[Teacher Questions API] POST Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save question." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if ((user.role !== "teacher" && user.role !== "admin") || user.teacherStatus === "pending_approval") {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("id");
  if (!user.isDemo) return NextResponse.json({ error: "Personal question-bank editing is not yet available for real accounts." }, { status: 503 });

  if (!questionId) {
    return NextResponse.json({ error: "Question ID is required." }, { status: 400 });
  }

  try {
    const archived = await archiveQuestionBankItem(user, questionId);
    return NextResponse.json({ ok: true, archived });
  } catch (err: unknown) {
    console.error("[Teacher Questions API] DELETE Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete question." },
      { status: 500 }
    );
  }
}
