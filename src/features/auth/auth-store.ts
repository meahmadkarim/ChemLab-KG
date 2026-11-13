"use client";

import { useState, useEffect, useCallback } from "react";

export type UserRole = "student" | "teacher" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school?: string;
  isDemo?: boolean;
  avatarUrl?: string;
  preferredLocale?: "ky" | "ru" | "en";
  teacherStatus?: "approved" | "pending_approval";
}

const SESSION_CACHE_KEY = "chemlab_kg_auth_session_v2";

/** Push a server-confirmed user (e.g. after a profile edit) to every mounted header/menu. */
export function publishAuthUser(user: AuthUser | null) {
  saveCachedAuthSession(user);
}

export function loadCachedAuthSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveCachedAuthSession(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(user));
    } else {
      window.sessionStorage.removeItem(SESSION_CACHE_KEY);
    }
    window.dispatchEvent(new CustomEvent("chemlab-auth-updated"));
  } catch {
    // Ignore storage errors
  }
}

export function useAuthStore() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    const syncFromCache = () => {
      if (!active) return;
      setUser(loadCachedAuthSession());
    };

    const verifyWithServer = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!active) return;
        if (res.ok) {
          const data = (await res.json()) as {
            authenticated: boolean;
            user: AuthUser | null;
          };
          const verifiedUser = data.authenticated ? data.user : null;
          setUser(verifiedUser);
          saveCachedAuthSession(verifiedUser);
        }
      } catch {
        // Fallback to session cache if offline
      } finally {
        if (active) setHydrated(true);
      }
    };

    const timer = window.setTimeout(() => {
      syncFromCache();
      void verifyWithServer();
    }, 0);

    window.addEventListener("chemlab-auth-updated", syncFromCache);
    return () => {
      active = false;
      window.clearTimeout(timer);
      window.removeEventListener("chemlab-auth-updated", syncFromCache);
    };
  }, []);

  const signIn = useCallback(
    async (params: {
      email: string;
      password: string;
    }): Promise<{ ok: boolean; user?: AuthUser; error?: string }> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const data = (await res.json()) as {
          ok: boolean;
          user?: AuthUser;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.user) {
          return {
            ok: false,
            error: data.error || "Invalid email or password.",
          };
        }
        saveCachedAuthSession(data.user);
        setUser(data.user);
        return { ok: true, user: data.user };
      } catch {
        return {
          ok: false,
          error: "Unable to sign in right now. Please try again.",
        };
      }
    },
    []
  );

  const signUp = useCallback(
    async (params: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
      school?: string;
    }): Promise<{ ok: boolean; user?: AuthUser; confirmationRequired?: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const data = (await res.json()) as {
          ok: boolean;
          user?: AuthUser;
          confirmationRequired?: boolean;
          error?: string;
        };
        if (res.ok && data.ok && data.confirmationRequired) return { ok: true, confirmationRequired: true };
        if (!res.ok || !data.ok || !data.user) {
          return {
            ok: false,
            error: data.error || "Unable to create account.",
          };
        }
        saveCachedAuthSession(data.user);
        setUser(data.user);
        return { ok: true, user: data.user };
      } catch {
        return {
          ok: false,
          error: "Unable to create account right now. Please try again.",
        };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors
    }
    saveCachedAuthSession(null);
    setUser(null);
  }, []);

  return {
    user,
    hydrated,
    signIn,
    signUp,
    signOut,
  };
}
