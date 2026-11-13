import { NextResponse, type NextRequest } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { changePasswordOnServer } from "@/features/auth/server-accounts";

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Please sign in to continue." },
      { status: 401 }
    );
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Email always comes from the verified session, never from the request body.
  const result = await changePasswordOnServer({
    email: user.email,
    currentPassword: body.currentPassword || "",
    newPassword: body.newPassword || "",
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
