import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { resolveLocale } from "@/i18n/dictionaries";
import { getServerSessionUser } from "@/features/auth/server-session";
import { toPublicProfile } from "@/features/profile/profile-store";
import { EditProfileClient } from "@/features/profile/EditProfileClient";
import type { Locale } from "@/i18n/config";

export default async function StudentEditProfilePage({
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
      <AuthenticatedEditProfileContent locale={locale} />
    </Suspense>
  );
}

async function AuthenticatedEditProfileContent({ locale }: { locale: Locale }) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser) {
    redirect(`/${locale}/login?next=/${locale}/me/profile/edit`);
  }

  const profile = await toPublicProfile(sessionUser);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <EditProfileClient profile={profile} locale={locale} />
    </div>
  );
}
