import { NextResponse, type NextRequest } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import {
  AVATAR_MAX_BYTES,
  AVATAR_MIME_TO_EXT,
  applyProfileToSession,
  deleteAvatar,
  detectImageExt,
  saveAvatar,
  toPublicProfile,
} from "@/features/profile/profile-store";
import { withRefreshedSession, unauthorized } from "@/features/profile/session-response";

/** Upload or replace the signed-in user's own avatar (multipart field `file`). */
export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) return unauthorized();

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > AVATAR_MAX_BYTES + 64 * 1024) {
    return NextResponse.json(
      { ok: false, error: "Image is too large. Maximum size is 2 MB." },
      { status: 413 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "Please choose an image." }, { status: 400 });
  }

  if (!AVATAR_MIME_TO_EXT[file.type]) {
    return NextResponse.json(
      { ok: false, error: "Only JPG, PNG, or WebP images are allowed." },
      { status: 415 }
    );
  }
  if (file.size <= 0 || file.size > AVATAR_MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image is too large. Maximum size is 2 MB." },
      { status: 413 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const realExt = detectImageExt(bytes);
  if (!realExt) {
    return NextResponse.json(
      { ok: false, error: "This file does not look like a valid JPG, PNG, or WebP image." },
      { status: 415 }
    );
  }

  await saveAvatar(user.id, bytes, realExt);
  const refreshed = await applyProfileToSession(user);
  const profile = await toPublicProfile(refreshed);
  return withRefreshedSession({ ok: true, profile }, refreshed);
}

/** Remove the signed-in user's own avatar. */
export async function DELETE(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) return unauthorized();

  await deleteAvatar(user.id);
  const refreshed = { ...(await applyProfileToSession(user)), avatarUrl: undefined };
  const profile = await toPublicProfile(refreshed);
  return withRefreshedSession({ ok: true, profile }, refreshed);
}
