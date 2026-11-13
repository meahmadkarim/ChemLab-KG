import { applyProfileToSession } from "@/features/profile/profile-store";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export type UserRole = "student" | "teacher" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  isDemo?: boolean;
  /** Short, same-origin URL such as `/api/profile/avatar/<id>?v=<ts>` (never a data URL). */
  avatarUrl?: string;
  preferredLocale?: "ky" | "ru" | "en";
  teacherStatus?: "approved" | "pending_approval";
}

interface SessionPayload extends SessionUser {
  exp: number;
}

export const SESSION_COOKIE_NAME = "chemlab_session";

function sessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SESSION_SECRET must contain at least 32 random characters.");
  }
  return secret;
}

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const keyBytes = stringToUint8Array(sessionSecret());
  return crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSessionToken(user: SessionUser): Promise<string> {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = toBase64Url(stringToUint8Array(payloadStr));
  const key = await getCryptoKey();
  const dataBytes = stringToUint8Array(payloadB64);
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    dataBytes.buffer as ArrayBuffer
  );
  const sigB64 = toBase64Url(new Uint8Array(sigBuffer));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token || token.split(".").length !== 2) return null;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  try {
    const key = await getCryptoKey();
    const sigBytes = fromBase64Url(sigB64);
    const dataBytes = stringToUint8Array(payloadB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      dataBytes.buffer as ArrayBuffer
    );
    if (!valid) return null;

    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadB64));
    const parsed = JSON.parse(payloadJson) as SessionPayload;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string" ||
      !["student", "teacher", "admin"].includes(parsed.role) ||
      !Number.isFinite(parsed.exp) ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      school: typeof parsed.school === "string" ? parsed.school : undefined,
      isDemo: parsed.isDemo,
      avatarUrl:
        typeof parsed.avatarUrl === "string" && parsed.avatarUrl.startsWith("/api/profile/avatar/")
          ? parsed.avatarUrl
          : undefined,
      preferredLocale:
        parsed.preferredLocale === "ky" || parsed.preferredLocale === "ru" || parsed.preferredLocale === "en"
          ? parsed.preferredLocale
          : undefined,
      teacherStatus:
        parsed.teacherStatus === "approved" || parsed.teacherStatus === "pending_approval"
          ? parsed.teacherStatus
          : undefined,
    };
  } catch {
    return null;
  }
}

async function resolveSession(token?: string): Promise<SessionUser | null> {
  const demo = await verifySessionToken(token);
  if (demo?.isDemo && ["usr-student-demo", "usr-teacher-demo"].includes(demo.id)) {
    return {
      ...demo,
      teacherStatus: demo.role === "teacher" ? "approved" : undefined,
    };
  }
  const client = await createSupabaseServerClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;

  const appRole = user.app_metadata?.role;
  const requestedRole = user.user_metadata?.requested_role;

  let role: UserRole = "student";
  let teacherStatus: "approved" | "pending_approval" | undefined = undefined;

  if (appRole === "admin") {
    role = "admin";
  } else if (appRole === "teacher") {
    role = "teacher";
    teacherStatus = "approved";
  } else if (requestedRole === "teacher") {
    role = "teacher";
    teacherStatus = "pending_approval";
  } else {
    role = "student";
  }

  const name =
    typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : "Learner";

  const school =
    typeof user.user_metadata?.school === "string" && user.user_metadata.school.trim()
      ? user.user_metadata.school.trim()
      : undefined;

  return applyProfileToSession({
    id: user.id,
    email: user.email ?? "",
    name,
    role,
    school,
    isDemo: false,
    teacherStatus,
  });
}

export async function getRequestSessionUser(request: NextRequest): Promise<SessionUser | null> {
  return resolveSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return resolveSession(jar.get(SESSION_COOKIE_NAME)?.value);
}
