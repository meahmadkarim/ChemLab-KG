import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoLogin } from "./demo-accounts";
import { getServerSessionUser, type SessionUser, type UserRole } from "./server-session";
import { upsertStoredProfile } from "@/features/profile/profile-store";
import { z } from "zod";

const credentials = z.object({
  email: z.string().email("Enter a valid email address.").max(254).transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, "Password is required.").max(256),
});

export async function authenticateUserOnServer(params: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; user?: SessionUser; error?: string }> {
  const parsed = credentials.safeParse(params);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Enter a valid email and password." };
  }

  // 1. Check demo accounts first
  const demo = demoLogin(parsed.data.email, parsed.data.password);
  if (demo) return { ok: true, user: demo };

  (await cookies()).delete("chemlab_session");
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("email not confirmed") || error.code === "email_not_confirmed") {
      return {
        ok: false,
        error: "Please confirm your email address before signing in. Check your inbox for the verification link.",
      };
    }
    if (error.code === "over_email_send_rate_limit" || error.status === 429) {
      return {
        ok: false,
        error: "Too many sign-in attempts. Please wait a few moments before trying again.",
      };
    }
    return {
      ok: false,
      error: "Invalid email or password. Please verify your credentials and try again.",
    };
  }

  const user = await getServerSessionUser();
  return user ? { ok: true, user } : { ok: false, error: "Unable to load your account." };
}

export async function registerUserOnServer(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  school?: string;
}): Promise<{
  ok: boolean;
  user?: SessionUser;
  confirmationRequired?: boolean;
  error?: string;
}> {
  // Prevent any user from registering as admin
  const safeRole: UserRole = params.role === "teacher" ? "teacher" : "student";

  const parsed = credentials
    .extend({
      name: z.string().trim().min(1, "Full name is required.").max(100),
      password: z.string().min(8, "Password must be at least 8 characters.").max(256),
    })
    .safeParse(params);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Enter a name, valid email, and password of at least 8 characters.",
    };
  }

  (await cookies()).delete("chemlab_session");
  const client = await createSupabaseServerClient();

  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        requested_role: safeRole,
        school: params.school?.trim() || "",
      },
    },
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit" || error.status === 429) {
      return {
        ok: false,
        error: "Verification email rate limit exceeded. Please wait a few minutes before trying again or sign in if you already registered.",
      };
    }
    if (error.code === "user_already_exists" || error.message?.toLowerCase().includes("already registered")) {
      return {
        ok: false,
        error: "An account with this email already exists. Please log in or reset your password.",
      };
    }
    if (error.code === "weak_password") {
      return {
        ok: false,
        error: "Password is too weak. Please choose a password with at least 8 characters.",
      };
    }
    if (error.code === "email_address_invalid") {
      return {
        ok: false,
        error: "The email address provided is invalid. Please check for typos.",
      };
    }
    return {
      ok: false,
      error: error.message || "Registration could not be completed. Please try again later.",
    };
  }

  // Account enumeration check: Supabase returns empty identities array when user already exists
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return {
      ok: false,
      error: "An account with this email already exists. Please log in or reset your password.",
    };
  }

  // Email confirmation required
  if (!data?.session) {
    return { ok: true, confirmationRequired: true };
  }

  // Session immediately available
  const user = await getServerSessionUser();
  if (user) {
    try {
      await upsertStoredProfile(user.id, {
        displayName: parsed.data.name,
        school: params.school?.trim() || "",
      });
    } catch (profileErr) {
      console.warn("[Auth] Non-fatal profile creation warning:", profileErr);
    }
    return { ok: true, user };
  }

  return { ok: false, error: "Account created, but unable to load session. Please sign in." };
}

export async function changePasswordOnServer(params: {
  email: string;
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: boolean; error?: string; useResetLink?: boolean }> {
  if (params.newPassword.length < 8 || params.newPassword.length > 256) {
    return { ok: false, error: "Use a password of 8–256 characters." };
  }
  (await cookies()).delete("chemlab_session");
  const client = await createSupabaseServerClient();
  const { error: verificationError } = await client.auth.signInWithPassword({
    email: params.email,
    password: params.currentPassword,
  });
  if (verificationError) return { ok: false, error: "Your current password is incorrect." };
  const { error } = await client.auth.updateUser({ password: params.newPassword });
  return error ? { ok: false, error: "Unable to update your password." } : { ok: true };
}
