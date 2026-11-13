import React from "react";
import { resolveLocale } from "@/i18n/dictionaries";
import { DevToolsClient } from "@/features/progress/DevToolsClient";

export default async function DevToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return <DevToolsClient locale={locale} />;
}
