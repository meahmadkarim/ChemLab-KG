import React from "react";

export type SectionTone =
  | "white"
  | "navy"
  | "warm"
  // Legacy aliases mapped strictly to the three approved tones
  | "blue"
  | "peach"
  | "lavender"
  | "sage"
  | "blue-gray";

/**
 * ChemLab KG — Strict Three-Color Section Background System
 * 1. Pure White:       #FFFFFF (clean, open sections)
 * 2. Deep Navy Blue:   #142D40 (immersive, premium scientific sections & hero blocks)
 * 3. Warm White:       #F8F7F4 (soft, comfortable separation between content)
 *
 * All other tints (blue, peach, lavender, sage, blue-gray) are mapped strictly
 * to White or Warm White so no unapproved background colors can render.
 */
const TONE_CLASSES: Record<SectionTone, string> = {
  white: "bg-white text-[#142D40]",
  navy: "bg-[#142D40] text-white",
  warm: "bg-[#F8F7F4] text-[#142D40]",
  // Legacy mappings:
  blue: "bg-white text-[#142D40]",
  lavender: "bg-white text-[#142D40]",
  peach: "bg-[#F8F7F4] text-[#142D40]",
  sage: "bg-[#F8F7F4] text-[#142D40]",
  "blue-gray": "bg-white text-[#142D40]",
};

export interface FullWidthSectionProps {
  id?: string;
  tone?: SectionTone;
  size?: "compact" | "default" | "spacious";
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<FullWidthSectionProps["size"]>, string> = {
  compact: "py-12 sm:py-16",
  default: "py-20 sm:py-24 lg:py-28",
  spacious: "py-24 sm:py-28 lg:py-32",
};

/**
 * Two-layer Full-Width Section Architecture:
 * 1. Outer `<section>` spans 100% of the browser viewport width and owns the background color & vertical spacing.
 * 2. Inner `.container-page` centers content within a readable maximum width.
 */
export function FullWidthSection({
  id,
  tone = "warm",
  size = "default",
  className = "",
  containerClassName = "",
  children,
}: FullWidthSectionProps) {
  return (
    <section
      id={id}
      className={`w-full ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}
    >
      <div className={`container-page ${containerClassName}`}>{children}</div>
    </section>
  );
}