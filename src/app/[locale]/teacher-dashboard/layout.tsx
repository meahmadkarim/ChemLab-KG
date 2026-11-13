import { redirect } from "next/navigation";
import { getServerSessionUser } from "@/features/auth/server-session";
import React, { Suspense } from "react";
import { resolveLocale } from "@/i18n/dictionaries";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

async function TeacherWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const user = await getServerSessionUser();
  if (!user) redirect(`/${locale}/login`);
  if (!["teacher", "admin"].includes(user.role)) redirect(`/${locale}/me`);

  return (
    <DashboardLayout role="teacher" locale={locale}>
      {children}
    </DashboardLayout>
  );
}

export default function ProtectedLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
 return <Suspense fallback={<p className="p-8" role="status">Loading your workspace…</p>}><TeacherWorkspaceLayout {...props} /></Suspense>;
}
