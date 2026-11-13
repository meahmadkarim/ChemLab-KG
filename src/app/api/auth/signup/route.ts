import { NextResponse, type NextRequest } from "next/server";
import { registerUserOnServer } from "@/features/auth/server-accounts";
import {
  SESSION_COOKIE_NAME,
  type UserRole,
} from "@/features/auth/server-session";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      school?: string;
    };

    const result = await registerUserOnServer({
      name: body.name || "",
      email: body.email || "",
      password: body.password || "",
      role: body.role === "teacher" ? "teacher" : "student",
      school: body.school,
    });

    if (result.ok && result.confirmationRequired) return NextResponse.json({ ok: true, confirmationRequired: true });
    if (!result.ok || !result.user) {
      return NextResponse.json(
        { ok: false, error: result.error || "Registration failed." },
        { status: 400 }
      );
    }

    const token = "";
    const response = NextResponse.json({ ok: true, user: result.user });
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
      { ok: false, error: "Invalid registration payload." },
      { status: 400 }
    );
  }
}
