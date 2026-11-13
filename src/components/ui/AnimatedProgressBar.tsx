"use client";

import React, { useEffect, useRef, useState } from "react";

export function AnimatedProgressBar({
  percent,
  heightClass = "h-3",
  trackClass = "bg-[#F8F7F4] border border-[#142D40]/10",
  fillClass = "bg-[#087F8C]",
  label = "Learning progress",
}: {
  percent: number;
  heightClass?: string;
  trackClass?: string;
  fillClass?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  const clamped = Math.max(4, Math.min(100, Math.round(percent)));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const timer = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEntered(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full rounded-full overflow-hidden ${heightClass} ${trackClass}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${fillClass}`}
        style={{ width: entered ? `${clamped}%` : "0%" }}
      />
    </div>
  );
}
