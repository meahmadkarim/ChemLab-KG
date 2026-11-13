import React from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ChemLabLogo } from "@/components/brand/ChemLabLogo";

export function Footer({
  locale,
  footer,
  nav,
}: {
  locale: Locale;
  footer: Dictionary["footer"];
  nav: Dictionary["nav"];
}) {
  return (
    <footer className="bg-[#142D40] text-white border-t border-white/10 mt-auto">
      <div className="container-page py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <ChemLabLogo href={`/${locale}`} size="md" theme="dark" />
            <p className="text-sm text-white/75 max-w-md leading-relaxed">
              {footer.tagline}
            </p>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {footer.linksTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/experiments`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {nav.experiments}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/safety`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {nav.safety}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {nav.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning & Teaching */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {footer.resourcesTitle}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/${locale}/students`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {locale === "ky"
                    ? "Окуучулар"
                    : locale === "ru"
                    ? "Ученикам"
                    : "Students"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/teachers`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {nav.teachers}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/login`}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {locale === "ky" ? "Кирүү" : locale === "ru" ? "Войти" : "Log In"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <nav aria-label="Policies" className="flex flex-wrap gap-6 pt-6 text-sm text-white/80">
          <Link href={`/${locale}/privacy`}>Privacy</Link><Link href={`/${locale}/accessibility`}>Accessibility</Link><Link href={`/${locale}/terms`}>Demo terms</Link>
        </nav>
        {/* Portfolio Disclosure */}
        <div className="pt-8 text-xs text-white/60 leading-relaxed">
          <strong className="text-white/90">{footer.disclaimerTitle}: </strong>
          {footer.disclaimerText}
        </div>
      </div>
    </footer>
  );
}
