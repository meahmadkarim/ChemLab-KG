import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { getTeacherClassroomReports, addTeacherReportReview } from "@/features/notebook/server-notebook";

const reviewSchema = z.object({
  reportId: z.string().min(1),
  feedbackText: z.string().trim().min(1, "Feedback cannot be empty.").max(5000),
});

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get("assignmentId");

  try {
    const reports = await getTeacherClassroomReports(user, assignmentId);
    return NextResponse.json({ ok: true, reports });
  } catch (err) {
    console.error("[Teacher Reports API] Failed to fetch reports:", err);
    return NextResponse.json({ error: "Failed to load classroom reports." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  try {
    const rawBody = await request.json();
    const parsed = reviewSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid review data." },
        { status: 400 }
      );
    }

    const reviewed = await addTeacherReportReview(
      user,
      parsed.data.reportId,
      parsed.data.feedbackText
    );

    return NextResponse.json({ ok: true, report: reviewed });
  } catch (err) {
    console.error("[Teacher Reports API] Failed to submit review:", err);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
