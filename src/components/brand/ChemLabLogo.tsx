import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface ChemLabLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "icon";
  theme?: "light" | "dark";
  className?: string;
  priority?: boolean;
}

const SIZES = {
  sm: {
    height: 28,
    width: 103, // 28 * (1386 / 376)
    iconSize: 28,
    containerClass: "h-7",
  },
  md: {
    height: 38,
    width: 140, // 38 * (1386 / 376)
    iconSize: 38,
    containerClass: "h-8 sm:h-[38px]",
  },
  lg: {
    height: 52,
    width: 192, // 52 * (1386 / 376)
    iconSize: 52,
    containerClass: "h-12 sm:h-[52px]",
  },
  xl: {
    height: 68,
    width: 251, // 68 * (1386 / 376)
    iconSize: 68,
    containerClass: "h-16 sm:h-[68px]",
  },
};

/**
 * ChemLabᴷᴳ — Official brand logo component.
 *
 * Uses the official ChemLab KG horizontal logo kit with:
 * - Standalone flask icon with orbiting electron
 * - Dark navy "ChemLab" wordmark
 * - Blue superscript "KG"
 * - Crisp, responsive, non-distorted rendering with transparent background
 * - Full screen-reader accessibility
 */
export function ChemLabLogo({
  href,
  size = "md",
  variant = "horizontal",
  theme = "light",
  className = "",
  priority = true,
}: ChemLabLogoProps) {
  const currentSize = SIZES[size];
  const isDark = theme === "dark";

  const isIconOnly = variant === "icon";

  const logoElement = isDark ? (
    <span
      className={`inline-flex items-center gap-2.5 ${currentSize.containerClass} ${className}`}
    >
      <Image
        src="/branding/chemlab-icon-512.png"
        alt="ChemLab KG"
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        priority={priority}
        className="h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
      <span className="font-brand font-extrabold tracking-tight text-white inline-flex items-baseline text-lg sm:text-xl">
        <span>ChemLab</span>
        <sup className="relative font-black tracking-wider uppercase inline-block leading-none text-[#38BDF8] text-[0.58em] -top-[0.5em] ml-0.5">
          KG
        </sup>
      </span>
    </span>
  ) : isIconOnly ? (
    <span
      className={`inline-flex items-center shrink-0 ${currentSize.containerClass} ${className}`}
    >
      <Image
        src="/branding/chemlab-icon-512.png"
        alt="ChemLab KG"
        width={currentSize.iconSize}
        height={currentSize.iconSize}
        priority={priority}
        className="h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </span>
  ) : (
    <span
      className={`inline-flex items-center shrink-0 ${currentSize.containerClass} ${className}`}
    >
      <Image
        src="/branding/chemlab-kg-horizontal-transparent.png"
        alt="ChemLab KG"
        width={currentSize.width}
        height={currentSize.height}
        priority={priority}
        className="h-full w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087F8C] rounded-lg transition-opacity hover:opacity-95"
        aria-label="ChemLab KG Home"
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
