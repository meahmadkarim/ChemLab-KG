import React, { Suspense } from "react";
import { resolveLocale } from "@/i18n/dictionaries";
import { SignupClient } from "@/features/auth/SignupClient";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9F8]" />}>
      <SignupClient locale={locale} />
    </Suspense>
  );
}
