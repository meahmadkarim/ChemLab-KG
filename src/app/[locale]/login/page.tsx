import React, { Suspense } from "react";
import { resolveLocale } from "@/i18n/dictionaries";
import { LoginClient } from "@/features/auth/LoginClient";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F7F4]" />}>
      <LoginClient locale={locale} />
    </Suspense>
  );
}
