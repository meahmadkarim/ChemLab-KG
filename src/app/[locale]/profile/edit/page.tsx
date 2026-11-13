import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { resolveLocale } from "@/i18n/dictionaries";
import { getServerSessionUser } from "@/features/auth/server-session";
import type { Locale } from "@/i18n/config";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <RedirectResolver locale={locale} />
    </Suspense>
  );
}

async function RedirectResolver({ locale }: { locale: Locale }) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser) {
    redirect(`/${locale}/login?next=/${locale}/profile/edit`);
  }

  if (sessionUser.role === "teacher") {
    redirect(`/${locale}/teacher-dashboard/profile/edit`);
  } else {
    redirect(`/${locale}/me/profile/edit`);
  }
  return null;
}
