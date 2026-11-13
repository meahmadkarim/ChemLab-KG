"use client";

import React from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface PublicLayoutChromeProps {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}

export function PublicLayoutChrome({
  locale,
  dict,
  children,
}: PublicLayoutChromeProps) {
  const pathname = usePathname();

  // Check if current route is an authenticated full-screen dashboard route
  const isDashboardRoute =
    pathname.startsWith(`/${locale}/me`) ||
    pathname.startsWith(`/${locale}/teacher-dashboard`) ||
    pathname.startsWith(`/${locale}/admin`) ||
    pathname.startsWith(`/${locale}/dev-tools`) ||
    pathname.startsWith(`/${locale}/app`);

  if (isDashboardRoute) {
    // Dedicated full-viewport application shell without public website header or footer
    return (
      <main className="h-dvh w-screen overflow-hidden bg-[#F8F7F4] flex flex-col">
        {children}
      </main>
    );
  }

  // Normal public website layout
  return (
    <>
      <Header locale={locale} nav={dict.nav} banner={dict.banner} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} footer={dict.footer} nav={dict.nav} />
    </>
  );
}
