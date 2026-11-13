import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { resolveLocale } from "@/i18n/dictionaries";
import { getServerSessionUser } from "@/features/auth/server-session";
import { toPublicProfile } from "@/features/profile/profile-store";
import { ProfileClient } from "@/features/profile/ProfileClient";
import type { Locale } from "@/i18n/config";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthenticatedProfileContent locale={locale} />
    </Suspense>
  );
}

async function AuthenticatedProfileContent({ locale }: { locale: Locale }) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser) {
    redirect(`/${locale}/login?next=/${locale}/me/profile`);
  }

  const profile = await toPublicProfile(sessionUser);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <ProfileClient profile={profile} locale={locale} />
    </div>
  );
}
