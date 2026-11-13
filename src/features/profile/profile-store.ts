// Server-only module (uses Node `fs`); import only from route handlers / server components.
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { promises as fs } from "fs";
import path from "path";
import type { SessionUser } from "@/features/auth/server-session";

// Supabase profiles and private avatars for real accounts; local files only for demo identities.
export type ProfileLocale = "ky" | "ru" | "en";

export interface StoredProfile {
  id: string;
  displayName?: string;
  bio?: string;
  school?: string;
  preferredLocale?: ProfileLocale;
  avatarExt?: AvatarExt;
  avatarVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  displayName: string;
  email: string;
  role: SessionUser["role"];
  bio: string;
  school: string;
  preferredLocale: ProfileLocale;
  avatarUrl: string | null;
  createdAt: string;
  isDemo: boolean;
}

export type AvatarExt = "jpg" | "png" | "webp";

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_MIME_TO_EXT: Record<string, AvatarExt> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
export const AVATAR_EXT_TO_MIME: Record<AvatarExt, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const DATA_DIR = path.join(process.cwd(), ".data");
const PROFILES_FILE = path.join(DATA_DIR, "profiles.json");
const AVATAR_DIR = path.join(DATA_DIR, "avatars");

const SAFE_ID = /^[A-Za-z0-9_-]{3,64}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertSafeId(id: string) {
  if (!SAFE_ID.test(id)) {
    throw new Error("Invalid user id");
  }
}

// Serialize writes within a single server process to avoid lost updates.
let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function readAll(): Promise<Record<string, StoredProfile>> {
  try {
    const raw = await fs.readFile(PROFILES_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, StoredProfile>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function writeAll(all: Record<string, StoredProfile>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${PROFILES_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(all, null, 2), "utf8");
  await fs.rename(tmp, PROFILES_FILE);
}

export async function getStoredProfile(id: string): Promise<StoredProfile | null> {
  assertSafeId(id);
  if (UUID.test(id)) {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.from("user_profiles").select("data").eq("id", id).maybeSingle();
    if (error) throw new Error("Unable to load profile.");
    return data?.data as StoredProfile ?? null;
  }
  const all = await readAll();
  return all[id] ?? null;
}

export async function upsertStoredProfile(
  id: string,
  patch: Partial<Omit<StoredProfile, "id" | "createdAt" | "updatedAt">>
): Promise<StoredProfile> {
  assertSafeId(id);
  if (UUID.test(id)) {
    const client = await createSupabaseServerClient();
    const now = new Date().toISOString();
    const existing = await getStoredProfile(id);
    const profile = { ...existing, ...patch, id, createdAt: existing?.createdAt ?? now, updatedAt: now };
    const { error } = await client.from("user_profiles").upsert({ id, data: profile, updated_at: now });
    if (error) throw new Error("Unable to save profile.");
    return profile;
  }
  return enqueue(async () => {
    const all = await readAll();
    const now = new Date().toISOString();
    const existing = all[id] ?? { id, createdAt: now, updatedAt: now };
    const next: StoredProfile = { ...existing, ...patch, id, updatedAt: now };
    all[id] = next;
    await writeAll(all);
    return next;
  });
}

export function avatarUrlFor(profile: StoredProfile | null): string | undefined {
  if (!profile?.avatarExt || !profile.avatarVersion) return undefined;
  return `/api/profile/avatar/${profile.id}?v=${profile.avatarVersion}`;
}

/** Merge persisted profile overrides into the session identity (used at login & after edits). */
export async function applyProfileToSession(user: SessionUser): Promise<SessionUser> {
  try {
    const profile = await getStoredProfile(user.id);
    if (!profile) return user;
    return {
      ...user,
      name: profile.displayName || user.name,
      school: profile.school ?? user.school,
      preferredLocale: profile.preferredLocale ?? user.preferredLocale,
      avatarUrl: avatarUrlFor(profile),
    };
  } catch {
    return user;
  }
}

export async function toPublicProfile(user: SessionUser): Promise<PublicProfile> {
  const profile = await getStoredProfile(user.id);
  return {
    id: user.id,
    displayName: profile?.displayName || user.name,
    email: user.email,
    role: user.role,
    bio: profile?.bio ?? "",
    school: profile?.school ?? user.school ?? "",
    preferredLocale: profile?.preferredLocale ?? user.preferredLocale ?? "ky",
    avatarUrl: avatarUrlFor(profile) ?? null,
    createdAt: profile?.createdAt ?? new Date().toISOString(),
    isDemo: Boolean(user.isDemo),
  };
}

/** Validate real file signature (magic bytes) — never trust the client-declared MIME type alone. */
export function detectImageExt(bytes: Uint8Array): AvatarExt | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === "RIFF" &&
    String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

async function removeLocalAvatarFiles(id: string) {
  for (const ext of Object.keys(AVATAR_EXT_TO_MIME) as AvatarExt[]) {
    await fs.rm(path.join(AVATAR_DIR, `${id}.${ext}`), { force: true });
  }
}

export async function saveAvatar(id: string, bytes: Uint8Array, ext: AvatarExt): Promise<StoredProfile> {
  assertSafeId(id);
  if (UUID.test(id)) {
    const client = await createSupabaseServerClient();
    const { error } = await client.storage.from("avatars").upload(`${id}/avatar.${ext}`, Buffer.from(bytes), { contentType: AVATAR_EXT_TO_MIME[ext], upsert: true });
    if (error) throw new Error("Unable to upload avatar.");
  } else {
    await fs.mkdir(AVATAR_DIR, { recursive: true });
    await fs.writeFile(path.join(AVATAR_DIR, `${id}.${ext}`), bytes);
  }
  return upsertStoredProfile(id, { avatarExt: ext, avatarVersion: Date.now() });
}

export async function deleteAvatar(id: string): Promise<StoredProfile> {
  assertSafeId(id);
  if (UUID.test(id)) {
    const client = await createSupabaseServerClient();
    const { error } = await client.storage.from("avatars").remove(Object.keys(AVATAR_EXT_TO_MIME).map(ext => `${id}/avatar.${ext}`));
    if (error) throw new Error("Unable to remove avatar.");
  } else await removeLocalAvatarFiles(id);
  return upsertStoredProfile(id, { avatarExt: undefined, avatarVersion: undefined });
}

export async function readAvatar(id: string): Promise<{ bytes: Buffer; mime: string } | null> {
  assertSafeId(id);
  const profile = await getStoredProfile(id);
  if (!profile?.avatarExt) return null;
  const ext = profile.avatarExt;
  if (UUID.test(id)) {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.storage.from("avatars").download(`${id}/avatar.${ext}`);
    if (error) return null;
    return { bytes: Buffer.from(await data.arrayBuffer()), mime: AVATAR_EXT_TO_MIME[ext] };
  }
  try { return { bytes: await fs.readFile(path.join(AVATAR_DIR, `${id}.${ext}`)), mime: AVATAR_EXT_TO_MIME[ext] }; }
  catch { return null; }
}
