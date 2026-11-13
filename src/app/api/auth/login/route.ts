import { NextResponse, type NextRequest } from "next/server";
import { authenticateUserOnServer } from "@/features/auth/server-accounts";
import { SESSION_COOKIE_NAME, signSessionToken } from "@/features/auth/server-session";
import { applyProfileToSession } from "@/features/profile/profile-store";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const result = await authenticateUserOnServer({
      email: body.email || "",
      password: body.password || "",
    });

    if (!result.ok || !result.user) {
      return NextResponse.json(
        { ok: false, error: result.error || "Authentication failed." },
        { status: 401 }
      );
    }

    // Merge persisted profile edits (display name, avatar, language) into the session.
    const user = await applyProfileToSession(result.user);
    const token = user.isDemo ? await signSessionToken(user) : "";
    const response = NextResponse.json({ ok: true, user });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
    secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: token ? 60 * 60 * 24 * 7 : 0,
    });
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
