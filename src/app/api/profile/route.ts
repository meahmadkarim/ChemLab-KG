import { NextResponse, type NextRequest } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import {
  toPublicProfile,
  upsertStoredProfile,
  applyProfileToSession,
  type ProfileLocale,
} from "@/features/profile/profile-store";
import { withRefreshedSession, unauthorized } from "@/features/profile/session-response";
import { LOCALE_COOKIE } from "@/i18n/config";

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) return unauthorized();
  const profile = await toPublicProfile(user);
  return NextResponse.json({ ok: true, profile });
}

/**
 * Update the signed-in user's own profile.
 * Only displayName, bio, school, and preferredLocale are editable. Role, email,
 * and id are taken from the verified session and can never be changed here.
 */
export async function PUT(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) return unauthorized();

  let body: {
    displayName?: unknown;
    bio?: unknown;
    school?: unknown;
    preferredLocale?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const patch: {
    displayName?: string;
    bio?: string;
    school?: string;
    preferredLocale?: ProfileLocale;
  } = {};

  if (body.displayName !== undefined) {
    const name = typeof body.displayName === "string" ? body.displayName.trim() : "";
    if (name.length < 2 || name.length > 60) {
      return NextResponse.json(
        { ok: false, error: "Display name must be between 2 and 60 characters." },
        { status: 400 }
      );
    }
    patch.displayName = name;
  }

  if (body.bio !== undefined) {
    const bio = typeof body.bio === "string" ? body.bio.trim() : "";
    if (bio.length > 280) {
      return NextResponse.json(
        { ok: false, error: "Bio must be 280 characters or fewer." },
        { status: 400 }
      );
    }
    patch.bio = bio;
  }

  if (body.school !== undefined) {
    const school = typeof body.school === "string" ? body.school.trim() : "";
    if (school.length > 120) {
      return NextResponse.json(
        { ok: false, error: "School name must be 120 characters or fewer." },
        { status: 400 }
      );
    }
    if (user.role === "teacher" && !school) {
      return NextResponse.json(
        { ok: false, error: "Teachers must keep a school name on their profile." },
        { status: 400 }
      );
    }
    patch.school = school;
  }

  if (body.preferredLocale !== undefined) {
    if (body.preferredLocale !== "ky" && body.preferredLocale !== "ru" && body.preferredLocale !== "en") {
      return NextResponse.json({ ok: false, error: "Unsupported language." }, { status: 400 });
    }
    patch.preferredLocale = body.preferredLocale;
  }

  await upsertStoredProfile(user.id, patch);
  const refreshed = await applyProfileToSession(user);
  const profile = await toPublicProfile(refreshed);

  const response = await withRefreshedSession({ ok: true, profile }, refreshed);
  if (patch.preferredLocale) {
    response.cookies.set(LOCALE_COOKIE, patch.preferredLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}
