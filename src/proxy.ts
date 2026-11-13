import { redirectWithSession } from "@/lib/supabase/redirect";
import { refreshSupabaseSession } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { getRequestSessionUser, type UserRole } from "@/features/auth/server-session";

function resolvePreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLang = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const part of acceptLang.split(",")) {
    const tag = part.trim().split(";")[0]?.trim() ?? "";
    const primary = tag.split("-")[0];
    if (isLocale(primary)) {
      return primary;
    }
  }

  return defaultLocale;
}

function getWorkspaceDashboard(role: UserRole | undefined, locale: string): string {
  if (role === "teacher") return `/${locale}/teacher-dashboard`;
  if (role === "admin") return `/${locale}/admin`;
  return `/${locale}/me`;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js assets, API routes, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    /\.(?:ico|png|jpg|jpeg|svg|webp|woff2?|txt|xml)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const sessionResponse = await refreshSupabaseSession(request);
  const redirect = (destination: URL) => redirectWithSession(destination, sessionResponse);
  const authCode = request.nextUrl.searchParams.get("code");
  if (authCode && pathname !== "/auth/callback") {
    const callback = new URL("/auth/callback", request.url);
    callback.searchParams.set("code", authCode);
    if (request.nextUrl.searchParams.get("next") === "/en/reset-password") {
      callback.searchParams.set("next", "/en/reset-password");
    }
    return redirect(callback);
  }
  if (pathname === "/auth/callback") return sessionResponse;

  const matchedLocale = locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  if (!matchedLocale) {
    const locale = resolvePreferredLocale(request);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return redirect(redirectUrl);
  }

  const originalSubPath = pathname.slice(`/${matchedLocale}`.length) || "/";
  const subPath = originalSubPath
    .replace(/^\/app\/student(?=\/|$)/, "/me")
    .replace(/^\/app\/teacher(?=\/|$)/, "/teacher-dashboard");

  const sessionUser = await getRequestSessionUser(request);

  // =========================================================================
  // CASE 1: USER IS NOT AUTHENTICATED (ANONYMOUS PUBLIC VISITOR)
  // =========================================================================
  if (!sessionUser) {
    // Protected Private Routes (/me, /teacher-dashboard, /admin, /dev-tools, /profile, /settings)
    if (
      subPath === "/me" ||
      subPath.startsWith("/me/") ||
      subPath === "/teacher-dashboard" ||
      subPath.startsWith("/teacher-dashboard/") ||
      subPath === "/admin" ||
      subPath.startsWith("/admin/") ||
      subPath === "/dev-tools" ||
      subPath.startsWith("/dev-tools/") ||
      subPath === "/profile" ||
      subPath.startsWith("/profile/") ||
      subPath === "/settings" ||
      subPath.startsWith("/settings/")
    ) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = `/${matchedLocale}/login`;
      loginUrl.searchParams.set("next", pathname);
      return redirect(loginUrl);
    }

    // Public visitors can freely access all public routes (/, /students, /teachers, /experiments, /about, /login, /signup, etc.)
    return sessionResponse;
  }

  // =========================================================================
  // CASE 2: USER IS AUTHENTICATED (STUDENT, TEACHER, OR ADMIN WORKSPACE)
  // =========================================================================
  const dashboard = getWorkspaceDashboard(sessionUser.role, matchedLocale);

  // 1. Redirect Authenticated Users Away From Public Entry Pages:
  // Public Homepage (/), Students (/students), Teachers (/teachers)
  if (subPath === "/" || subPath === "/students" || subPath === "/teachers") {
    return redirect(new URL(dashboard, request.url));
  }

  // 2. Redirect Authenticated Users Away From Login & Signup
  if (subPath === "/login" || subPath === "/signup") {
    const hasRecoveryParam =
      request.nextUrl.searchParams.has("code") ||
      request.nextUrl.searchParams.has("token") ||
      request.nextUrl.searchParams.has("type") ||
      request.nextUrl.searchParams.get("mode") === "reset";

    if (!hasRecoveryParam) {
      const nextParam = request.nextUrl.searchParams.get("next");
      const safeNext =
        nextParam && nextParam.startsWith(`/${matchedLocale}/`) && !nextParam.includes("\\")
          ? nextParam
          : null;
      return redirect(new URL(safeNext || dashboard, request.url));
    }
  }

  // 3. Redirect Authenticated Users Away From Public Experiment Pages
  // Ensure experiment navigation resolves safely into the equivalent authorized workspace experiment
  if (subPath === "/experiments") {
    const dest =
      sessionUser.role === "student"
        ? `/${matchedLocale}/me/learning`
        : sessionUser.role === "teacher"
        ? `/${matchedLocale}/teacher-dashboard/resources`
        : `/${matchedLocale}/admin`;
    return redirect(new URL(dest, request.url));
  }

  if (subPath.startsWith("/experiments/")) {
    const expSlug = subPath.slice("/experiments/".length);
    const search = request.nextUrl.search;
    const dest =
      sessionUser.role === "student"
        ? `/${matchedLocale}/me/experiments/${expSlug}${search}`
        : `/${matchedLocale}/teacher-dashboard/experiments/${expSlug}${search}`;
    return redirect(new URL(dest, request.url));
  }

  // 4. Role-Based Workspace Separation (Prevent Cross-Role Access)
  // Students must remain inside /me
  if (sessionUser.role === "student") {
    if (
      subPath === "/teacher-dashboard" ||
      subPath.startsWith("/teacher-dashboard/") ||
      subPath === "/admin" ||
      subPath.startsWith("/admin/") ||
      subPath === "/dev-tools" ||
      subPath.startsWith("/dev-tools/")
    ) {
      return redirect(new URL(`/${matchedLocale}/me`, request.url));
    }
    if (subPath === "/profile" || subPath.startsWith("/profile/")) {
      const sub = subPath.slice("/profile".length);
      return redirect(new URL(`/${matchedLocale}/me/profile${sub}`, request.url));
    }
    if (subPath === "/settings" || subPath.startsWith("/settings/")) {
      const sub = subPath.slice("/settings".length);
      return redirect(new URL(`/${matchedLocale}/me/settings${sub}`, request.url));
    }
  }

  // Teachers must remain inside /teacher-dashboard
  if (sessionUser.role === "teacher") {
    if (
      subPath === "/me" ||
      subPath.startsWith("/me/") ||
      subPath === "/admin" ||
      subPath.startsWith("/admin/") ||
      subPath === "/dev-tools" ||
      subPath.startsWith("/dev-tools/")
    ) {
      return redirect(new URL(`/${matchedLocale}/teacher-dashboard`, request.url));
    }
    if (subPath === "/profile" || subPath.startsWith("/profile/")) {
      const sub = subPath.slice("/profile".length);
      return redirect(new URL(`/${matchedLocale}/teacher-dashboard/profile${sub}`, request.url));
    }
    if (subPath === "/settings" || subPath.startsWith("/settings/")) {
      const sub = subPath.slice("/settings".length);
      return redirect(new URL(`/${matchedLocale}/teacher-dashboard/settings${sub}`, request.url));
    }
  }

  // Admins
  if (sessionUser.role === "admin") {
    if (subPath === "/profile" || subPath.startsWith("/profile/")) {
      return redirect(new URL(`/${matchedLocale}/admin`, request.url));
    }
  }

  return sessionResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
