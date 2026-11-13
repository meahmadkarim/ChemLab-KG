"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Bookmark,
  Users,
  ClipboardList,
  User,
  BarChart3,
  Layers,
  Search,
  Globe,
  ChevronDown,
  LogOut,
  Pencil,
  Settings,
  Menu,
  X,
  FlaskConical,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { locales, localeLabels, LOCALE_COOKIE } from "@/i18n/config";
import { useAuthStore } from "@/features/auth/auth-store";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ExperimentSearchDialog } from "@/components/search/ExperimentSearchDialog";

export type DashboardActiveTab =
  | "dashboard"
  | "learning"
  | "saved"
  | "classrooms"
  | "assignments"
  | "progress"
  | "resources"
  | "profile";

interface DashboardLayoutProps {
  role: "student" | "teacher";
  activeTab?: DashboardActiveTab;
  locale: Locale;
  children: React.ReactNode;
}

function persistLocaleCookie(nextLocale: Locale) {
  if (typeof window !== "undefined") {
    window.document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function DashboardLayout({
  role,
  activeTab,
  locale,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);

  // Automatically resolve the active sidebar tab based on URL path when not explicitly set
  const resolvedActiveTab: DashboardActiveTab = React.useMemo(() => {
    if (activeTab && activeTab !== "dashboard") return activeTab;
    if (role === "student") {
      if (pathname.includes("/me/learning") || pathname.includes("/me/experiments")) {
        return "learning";
      }
      if (pathname.includes("/me/saved")) return "saved";
      if (pathname.includes("/me/classrooms")) return "classrooms";
      if (pathname.includes("/me/assignments")) return "assignments";
      if (pathname.includes("/me/profile") || pathname.includes("/me/settings")) {
        return "profile";
      }
      return "dashboard";
    } else {
      if (pathname.includes("/teacher-dashboard/classrooms")) return "classrooms";
      if (pathname.includes("/teacher-dashboard/assignments")) return "assignments";
      if (pathname.includes("/teacher-dashboard/progress")) return "progress";
      if (
        pathname.includes("/teacher-dashboard/resources") ||
        pathname.includes("/teacher-dashboard/experiments")
      ) {
        return "resources";
      }
      if (
        pathname.includes("/teacher-dashboard/profile") ||
        pathname.includes("/teacher-dashboard/settings")
      ) {
        return "profile";
      }
      return "dashboard";
    }
  }, [activeTab, pathname, role]);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K search shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  function handleSwitchLocale(nextLocale: Locale) {
    if (nextLocale === locale) {
      setLangMenuOpen(false);
      return;
    }
    persistLocaleCookie(nextLocale);
    const segments = pathname.split("/");
    if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    const targetPath = segments.join("/") || `/${nextLocale}`;
    router.push(targetPath);
    setLangMenuOpen(false);
  }

  // Student navigation items matching approved screenshot
  const studentNavItems = [
    {
      id: "dashboard" as const,
      label:
        locale === "ky"
          ? "Башкаруу панели"
          : locale === "ru"
          ? "Панель"
          : "Dashboard",
      icon: Home,
      href: `/${locale}/me`,
    },
    {
      id: "learning" as const,
      label:
        locale === "ky"
          ? "Менин окуум"
          : locale === "ru"
          ? "Моё обучение"
          : "My Learning",
      icon: BookOpen,
      href: `/${locale}/me/learning`,
    },
    {
      id: "saved" as const,
      label:
        locale === "ky"
          ? "Сакталгандар"
          : locale === "ru"
          ? "Сохранённые"
          : "Saved",
      icon: Bookmark,
      href: `/${locale}/me/saved`,
    },
    {
      id: "classrooms" as const,
      label:
        locale === "ky"
          ? "Класстар"
          : locale === "ru"
          ? "Классы"
          : "Classrooms",
      icon: Users,
      href: `/${locale}/me/classrooms`,
    },
    {
      id: "assignments" as const,
      label:
        locale === "ky"
          ? "Тапшырмалар"
          : locale === "ru"
          ? "Задания"
          : "Assignments",
      icon: ClipboardList,
      href: `/${locale}/me/assignments`,
    },
    {
      id: "profile" as const,
      label:
        locale === "ky"
          ? "Профиль"
          : locale === "ru"
          ? "Профиль"
          : "Profile",
      icon: User,
      href: `/${locale}/me/profile`,
    },
  ];

  // Teacher navigation items matching approved screenshot
  const teacherNavItems = [
    {
      id: "dashboard" as const,
      label:
        locale === "ky"
          ? "Башкаруу панели"
          : locale === "ru"
          ? "Панель"
          : "Dashboard",
      icon: Home,
      href: `/${locale}/teacher-dashboard`,
    },
    {
      id: "classrooms" as const,
      label:
        locale === "ky"
          ? "Менин класстарым"
          : locale === "ru"
          ? "Мои классы"
          : "My Classrooms",
      icon: Users,
      href: `/${locale}/teacher-dashboard/classrooms`,
    },
    {
      id: "assignments" as const,
      label:
        locale === "ky"
          ? "Тапшырмалар"
          : locale === "ru"
          ? "Задания"
          : "Assignments",
      icon: ClipboardList,
      href: `/${locale}/teacher-dashboard/assignments`,
    },
    {
      id: "progress" as const,
      label:
        locale === "ky"
          ? "Окуучулардын прогресси"
          : locale === "ru"
          ? "Успеваемость"
          : "Student Progress",
      icon: BarChart3,
      href: `/${locale}/teacher-dashboard/progress`,
    },
    {
      id: "resources" as const,
      label:
        locale === "ky"
          ? "Материалдар"
          : locale === "ru"
          ? "Материалы"
          : "Resources",
      icon: Layers,
      href: `/${locale}/teacher-dashboard/resources`,
    },
    {
      id: "profile" as const,
      label:
        locale === "ky"
          ? "Профиль"
          : locale === "ru"
          ? "Профиль"
          : "Profile",
      icon: User,
      href: `/${locale}/teacher-dashboard/profile`,
    },
  ];

  const navItems = role === "student" ? studentNavItems : teacherNavItems;

  const dashboardHomeHref =
    role === "teacher"
      ? `/${locale}/teacher-dashboard`
      : user?.role === "admin"
      ? `/${locale}/admin`
      : `/${locale}/me`;

  return (
    <div className="h-dvh w-full overflow-hidden flex bg-[#142D40]">
      {/* DESKTOP FIXED NAVY SIDEBAR */}
      <aside className="hidden lg:flex w-60 xl:w-64 bg-[#142D40] text-white flex-col justify-between shrink-0 border-r border-white/10 select-none">
        <div>
          {/* Top Brand Logo */}
          <Link
            href={dashboardHomeHref}
            className="h-16 px-6 flex items-center gap-3 border-b border-white/10 group cursor-pointer"
          >
            <FlaskConical className="size-6 text-[#38BDF8] group-hover:scale-105 transition-transform" />
            <span className="font-brand font-bold text-lg text-white tracking-tight">
              ChemLab<sup className="text-xs ml-0.5 text-[#38BDF8] font-bold">KG</sup>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1" aria-label="Dashboard Navigation">
            {navItems.map((item) => {
              const isActive = resolvedActiveTab === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-[#087F8C]/40 text-white font-semibold shadow-xs"
                      : "text-white/70 hover:text-white hover:bg-white/8 font-medium"
                  }`}
                >
                  <Icon
                    className={`size-4.5 ${
                      isActive ? "text-[#38BDF8]" : "text-white/70"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sign Out */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-colors cursor-pointer text-left"
          >
            <LogOut className="size-4.5" />
            <span>
              {locale === "ky" ? "Чыгуу" : locale === "ru" ? "Выйти" : "Sign Out"}
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-[#142D40] text-white flex flex-col justify-between h-full p-4 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Link
                  href={dashboardHomeHref}
                  className="flex items-center gap-2.5"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <FlaskConical className="size-6 text-[#38BDF8]" />
                  <span className="font-brand font-bold text-lg text-white">
                    ChemLab<sup className="text-xs ml-0.5 text-[#38BDF8]">KG</sup>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = resolvedActiveTab === item.id;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm ${
                        isActive
                          ? "bg-[#087F8C]/40 text-white font-semibold"
                          : "text-white/70 hover:text-white hover:bg-white/8 font-medium"
                      }`}
                    >
                      <Icon className="size-4.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 text-left"
              >
                <LogOut className="size-4.5" />
                <span>
                  {locale === "ky" ? "Чыгуу" : locale === "ru" ? "Выйти" : "Sign Out"}
                </span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN APPLICATION CONTAINER (TOP HEADER + CONTENT) */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-[#F8F7F4] overflow-hidden">
        {/* TOP UTILITY HEADER (White, 64px, Minimal, Matches Approved Screenshot) */}
        <header className="h-16 bg-white border-b border-slate-200/70 px-5 sm:px-8 flex items-center justify-between gap-4 shrink-0 z-20">
          {/* Left: Mobile Toggle + Search Box */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#142D40] hover:bg-slate-100 cursor-pointer shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Clean Rectangular Search Box Matching Screenshot */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-full max-w-md min-w-0 flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 text-left text-xs sm:text-sm text-[#536574] transition-colors cursor-pointer shadow-2xs group"
              aria-label="Search experiments, topics, or materials"
            >
              <Search className="size-4 text-[#536574] group-hover:text-[#087F8C] transition-colors shrink-0" />
              <span className="truncate">
                {locale === "ky"
                  ? "Тажрыйбаларды, темаларды издөө..."
                  : locale === "ru"
                  ? "Поиск экспериментов, тем или материалов..."
                  : "Search experiments, topics, or materials..."}
              </span>
            </button>
          </div>

          {/* Right: Language Selector + User Avatar */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Selector Dropdown */}
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#142D40] hover:bg-slate-100 transition-colors cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
              >
                <Globe className="size-4 text-[#536574]" />
                <span>{localeLabels[locale].long}</span>
                <ChevronDown
                  className={`size-3 text-[#536574] transition-transform ${
                    langMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 z-50 animate-in fade-in duration-100">
                  {locales.map((loc) => {
                    const isSelected = loc === locale;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleSwitchLocale(loc)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-[#087F8C]/10 text-[#087F8C]"
                            : "text-[#142D40] hover:bg-slate-50"
                        }`}
                      >
                        <span>{localeLabels[loc].long}</span>
                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-[#087F8C]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User Profile Avatar with Menu */}
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#087F8C]/30 transition-all cursor-pointer"
              >
                <UserAvatar
                  name={user?.name || (role === "teacher" ? "Amina Sadykova" : "Amina")}
                  src={user?.avatarUrl}
                  size="sm"
                  className="size-8 sm:size-9"
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-sm font-bold text-[#142D40] truncate">
                      {user?.name || (role === "teacher" ? "Amina Sadykova" : "Amina")}
                    </p>
                    <p className="text-xs text-[#536574] truncate">
                      {user?.email || "student@chemlab.kg"}
                    </p>
                  </div>

                  <Link
                    href={
                      role === "student"
                        ? `/${locale}/me/profile`
                        : `/${locale}/teacher-dashboard/profile`
                    }
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#142D40] hover:bg-slate-50"
                  >
                    <User className="size-4 text-[#536574]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href={
                      role === "student"
                        ? `/${locale}/me/profile/edit`
                        : `/${locale}/teacher-dashboard/profile/edit`
                    }
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#142D40] hover:bg-slate-50"
                  >
                    <Pencil className="size-4 text-[#536574]" />
                    <span>Edit Profile</span>
                  </Link>

                  <Link
                    href={
                      role === "student"
                        ? `/${locale}/me/settings`
                        : `/${locale}/teacher-dashboard/settings`
                    }
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#142D40] hover:bg-slate-50"
                  >
                    <Settings className="size-4 text-[#536574]" />
                    <span>Settings</span>
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT REGION */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8 xl:p-9 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* SEARCH MODAL DIALOG */}
      <ExperimentSearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        locale={locale}
        role={role}
      />
    </div>
  );
}
