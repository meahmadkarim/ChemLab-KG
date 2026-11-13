/* eslint-disable @next/next/no-img-element */
import React from "react";

const SIZE: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-xl",
  xl: "size-28 text-3xl",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${second}`.toUpperCase();
}

/** Profile avatar with an accessible initials fallback when no picture is uploaded. */
export function UserAvatar({
  name,
  src,
  user,
  size = "md",
  className = "",
}: {
  name?: string;
  src?: string | null;
  user?: {
    name: string;
    avatarUrl?: string | null;
    role?: string;
  };
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const resolvedName = name ?? user?.name ?? "User";
  const resolvedSrc = src !== undefined ? src : user?.avatarUrl;

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={`${resolvedName} profile picture`}
        className={`${SIZE[size]} rounded-full object-cover bg-[#EAE3F5] ring-2 ring-white ${className}`}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={`${resolvedName} avatar`}
      className={`${SIZE[size]} inline-flex shrink-0 items-center justify-center rounded-full bg-[#DCECF6] font-bold text-[#142D40] ring-2 ring-white ${className}`}
    >
      {initials(resolvedName)}
    </span>
  );
}
