import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import {
  shareNotebookWithClassrooms,
  revokeClassroomShare,
  revokeAllClassroomShares,
} from "@/features/notebook/server-teacher-notebook";
import type { NotebookSectionKey } from "@/features/notebook/types";

const shareSchema = z.object({
  experimentSlug: z.string().min(1).max(200),
  classroomIds: z.array(z.string().min(1)).min(1),
  sharedSections: z.array(
    z.enum(["aim_hypothesis", "procedure", "observations", "conclusion"])
  ).min(1),
});

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (user.role !== "teacher" && user.role !== "admin") {
    return NextResponse.json({ error: "Teacher authorization required." }, { status: 403 });
  }

  try {
    const rawBody = await request.json();
    const parsed = shareSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid sharing request.", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const result = await shareNotebookWithClassrooms(user, {
      experimentSlug: parsed.data.experimentSlug,
      classroomIds: parsed.data.classroomIds,
      sharedSections: parsed.data.sharedSections as NotebookSectionKey[],
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    console.error("[Teacher Notebook Share API] POST Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to share notebook with classroom." },
      { status: 500 }
    );
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
  const classroomId = searchParams.get("classroomId");
  const all = searchParams.get("all");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing required parameter: slug." },
      { status: 400 }
    );
  }

  try {
    if (all === "true") {
      const revokedAll = await revokeAllClassroomShares(user, slug);
      return NextResponse.json({ ok: true, revokedAll });
    }

    if (!classroomId) {
      return NextResponse.json(
        { error: "Missing required parameters: classroomId or all=true." },
        { status: 400 }
      );
    }

    const revoked = await revokeClassroomShare(user, slug, classroomId);
    return NextResponse.json({ ok: true, revoked });
  } catch (err: unknown) {
    console.error("[Teacher Notebook Share API] DELETE Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to revoke classroom share." },
      { status: 500 }
    );
  }
}
