import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { resolveLocale } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAllExperiments } from "@/features/experiments/server-catalog";
import { TeacherDashboardClient } from "@/features/classrooms/TeacherDashboardClient";
import { getServerSessionUser } from "@/features/auth/server-session";
import type { DashboardActiveTab } from "@/components/dashboard/DashboardLayout";

export default async function ProtectedTeacherDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const experiments = await getAllExperiments();

  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthenticatedTeacherContent
        locale={locale}
        experiments={experiments}
        searchParamsPromise={searchParams}
      />
    </Suspense>
  );
}

async function AuthenticatedTeacherContent({
  locale,
  experiments,
  searchParamsPromise,
}: {
  locale: Locale;
  experiments: Awaited<ReturnType<typeof getAllExperiments>>;
  searchParamsPromise: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParamsPromise;
  const sessionUser = await getServerSessionUser();

  if (!sessionUser) {
    redirect(`/${locale}/login?next=/${locale}/teacher-dashboard`);
  }

  if (sessionUser.role !== "teacher" && sessionUser.role !== "admin") {
    redirect(`/${locale}/me`);
  }

  return (
    <TeacherDashboardClient
      experiments={experiments}
      locale={locale}
      activeTab={(tab as DashboardActiveTab) || "dashboard"}
    />
  );
}
