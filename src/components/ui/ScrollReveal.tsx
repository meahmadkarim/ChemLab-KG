"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealVariant =
  | "fade-up"
  | "scale-in"
  | "slide-left"
  | "slide-right";

export interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  className?: string;
}

const HIDDEN_CLASSES: Record<RevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-6",
  "scale-in": "opacity-0 scale-[0.96] translate-y-3",
  "slide-left": "opacity-0 -translate-x-5",
  "slide-right": "opacity-0 translate-x-5",
};

const VISIBLE_CLASSES = "opacity-100 translate-y-0 translate-x-0 scale-100";

/**
 * Lightweight, hardware-accelerated scroll-reveal wrapper using IntersectionObserver.
 * Animates once when entering the viewport and respects `prefers-reduced-motion`.
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  delayMs = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -36px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-all duration-600 ease-out will-change-[opacity,transform] ${
        visible ? VISIBLE_CLASSES : HIDDEN_CLASSES[variant]
      } ${className}`}
    >
      {children}
    </div>
  );
}
