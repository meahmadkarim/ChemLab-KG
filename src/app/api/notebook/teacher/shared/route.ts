import { NextRequest, NextResponse } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import {
  getStudentAccessibleTeacherNotes,
  getStudentClassroomSharedNotes,
} from "@/features/notebook/server-teacher-notebook";

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const classroomId = searchParams.get("classroomId");

  try {
    if (classroomId && !slug) {
      const shares = await getStudentClassroomSharedNotes(user, classroomId);
      return NextResponse.json({ ok: true, shares });
    }

    if (slug) {
      const shares = await getStudentAccessibleTeacherNotes(user, slug, classroomId);
      return NextResponse.json({ ok: true, shares });
    }

    // Default: return all shared notes for student's classrooms
    const shares = await getStudentClassroomSharedNotes(user, null);
    return NextResponse.json({ ok: true, shares });
  } catch (err: unknown) {
    console.error("[Shared Teacher Notes API] GET Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch shared teacher notes." },
      { status: 500 }
    );
  }
}
