import React, { Suspense } from "react";
import { resolveLocale } from "@/i18n/dictionaries";
import { getAllExperiments } from "@/features/experiments/server-catalog";
import { TeacherResourcesClient } from "@/features/classrooms/TeacherResourcesClient";

export default async function TeacherResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
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
      <TeacherResourcesClient experiments={experiments} locale={locale} />
    </Suspense>
  );
}
