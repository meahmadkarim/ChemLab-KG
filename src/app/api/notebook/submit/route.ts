import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { submitStudentLabReport } from "@/features/notebook/server-notebook";

const submitSchema = z.object({
  experimentSlug: z.string().min(1).max(200),
  assignmentId: z.string().uuid().nullable().optional(),
});

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parsed = submitSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission parameters." }, { status: 400 });
    }

    const submitted = await submitStudentLabReport(
      user,
      parsed.data.experimentSlug,
      parsed.data.assignmentId
    );

    return NextResponse.json({ ok: true, report: submitted });
  } catch (err) {
    console.error("[Notebook API] Failed to submit report:", err);
    return NextResponse.json({ error: "Failed to submit laboratory report." }, { status: 500 });
  }
}
