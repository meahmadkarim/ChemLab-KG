import { NextResponse, type NextRequest } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { readAvatar } from "@/features/profile/profile-store";

/**
 * Serve an avatar image. Access-controlled: only signed-in users may fetch avatars,
 * and students may only fetch their own. Teachers may view avatars (e.g. for roster
 * display) but cannot modify them — writes go through POST/DELETE /api/profile/avatar,
 * which always target the caller's own id.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const viewer = await getRequestSessionUser(request);
  if (!viewer) {
    return new NextResponse(null, { status: 401 });
  }

  const { userId } = await params;
  if (!/^[A-Za-z0-9_-]{3,64}$/.test(userId)) {
    return new NextResponse(null, { status: 400 });
  }
  if (viewer.id !== userId) {
    return new NextResponse(null, { status: 403 });
  }

  const avatar = await readAvatar(userId);
  if (!avatar) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(avatar.bytes), {
    status: 200,
    headers: {
      "Content-Type": avatar.mime,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
