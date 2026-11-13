import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSessionUser } from "@/features/auth/server-session";
import { resolveLocale } from "@/i18n/dictionaries";

async function AdminGuard({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale);
  const user = await getServerSessionUser();
  if (!user || user.role !== "admin" || user.isDemo) redirect(`/${locale}/login`);
  return children;
}
export default function AdminLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  return <Suspense fallback={<p role="status" className="p-8">Checking administrator access…</p>}><AdminGuard {...props} /></Suspense>;
}
