import React, { Suspense } from "react";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import { getAllExperiments } from "@/features/experiments/server-catalog";
import { StudentDashboardClient } from "@/features/progress/StudentDashboardClient";

export default async function StudentClassroomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
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
      <StudentDashboardClient
        experiments={experiments}
        locale={locale}
        activeTab="classrooms"
        libraryCopy={dict.library}
        featuredCopy={dict.featured}
      />
    </Suspense>
  );
}
