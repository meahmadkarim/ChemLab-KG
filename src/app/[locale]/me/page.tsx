import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAllExperiments } from "@/features/experiments/server-catalog";
import { StudentDashboardClient } from "@/features/progress/StudentDashboardClient";
import { getServerSessionUser } from "@/features/auth/server-session";
import type { DashboardActiveTab } from "@/components/dashboard/DashboardLayout";

export default async function StudentDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);
  const experiments = await getAllExperiments();

  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthenticatedStudentContent
        locale={locale}
        experiments={experiments}
        libraryCopy={dict.library}
        featuredCopy={dict.featured}
        searchParamsPromise={searchParams}
      />
    </Suspense>
  );
}

async function AuthenticatedStudentContent({
  locale,
  experiments,
  libraryCopy,
  featuredCopy,
  searchParamsPromise,
}: {
  locale: Locale;
  experiments: Awaited<ReturnType<typeof getAllExperiments>>;
  libraryCopy: Awaited<ReturnType<typeof getDictionary>>["library"];
  featuredCopy: Awaited<ReturnType<typeof getDictionary>>["featured"];
  searchParamsPromise: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParamsPromise;
  const sessionUser = await getServerSessionUser();
  if (!sessionUser) {
    redirect(`/${locale}/login?next=/${locale}/me`);
  }

  return (
    <StudentDashboardClient
      experiments={experiments}
      locale={locale}
      activeTab={(tab as DashboardActiveTab) || "dashboard"}
      libraryCopy={libraryCopy}
      featuredCopy={featuredCopy}
    />
  );
}
