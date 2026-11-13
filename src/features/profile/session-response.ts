import { NextResponse } from "next/server";
import type { SessionUser } from "@/features/auth/server-session";
import { SESSION_COOKIE_NAME, signSessionToken } from "@/features/auth/server-session";

/** Attach a freshly re-signed session cookie so header/avatar updates appear immediately. */
export async function withRefreshedSession<T extends object>(
  body: T,
  user: SessionUser,
  init?: ResponseInit
) {
  const token = user.isDemo ? await signSessionToken(user) : "";
  const response = NextResponse.json({ ...body, user }, init);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: token ? 60 * 60 * 24 * 7 : 0,
  });
  return response;
}

export function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Please sign in to continue." },
    { status: 401 }
  );
}
