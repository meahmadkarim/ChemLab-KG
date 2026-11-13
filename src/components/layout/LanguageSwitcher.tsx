"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeLabels, LOCALE_COOKIE, type Locale } from "@/i18n/config";

function persistLocaleCookie(nextLocale: Locale) {
  if (typeof window !== "undefined") {
    window.document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function LanguageSwitcher({
  currentLocale,
  ariaLabel = "Select language",
  variant = "light",
}: {
  currentLocale: Locale;
  ariaLabel?: string;
  variant?: "light" | "dark";
}) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale) return;
    persistLocaleCookie(nextLocale);
    const segments = pathname.split("/");
    if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    const targetPath = segments.join("/") || `/${nextLocale}`;
    router.push(targetPath);
  }

  const isDark = variant === "dark";

  return (
    <div
      className="inline-flex items-center gap-1.5 select-none"
      role="group"
      aria-label={ariaLabel}
    >
      {locales.map((loc, idx) => {
        const active = loc === currentLocale;
        return (
          <React.Fragment key={loc}>
            {idx > 0 && (
              <span
                className={`text-[11px] select-none ${
                  isDark ? "text-white/25" : "text-[#142D40]/25"
                }`}
                aria-hidden="true"
              >
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => switchLocale(loc)}
              aria-pressed={active}
              title={localeLabels[loc].long}
              className={`cursor-pointer px-1 py-0.5 text-[11px] uppercase tracking-wider transition-all duration-150 relative ${
                active
                  ? isDark
                    ? "font-extrabold text-white"
                    : "font-extrabold text-[#142D40]"
                  : isDark
                  ? "font-medium text-white/60 hover:text-white"
                  : "font-medium text-[#536574] hover:text-[#142D40]"
              }`}
            >
              <span>{localeLabels[loc].short}</span>
              {active && (
                <span
                  className={`absolute -bottom-0.5 left-1 right-1 h-[2px] rounded-full ${
                    isDark ? "bg-[#38BDF8]" : "bg-[#142D40]"
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
