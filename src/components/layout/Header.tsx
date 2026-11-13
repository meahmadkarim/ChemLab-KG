"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Pencil,
  Settings,
  ChevronDown,
  Search,
  Bell,
  Users,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuthStore, type AuthUser } from "@/features/auth/auth-store";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ChemLabLogo } from "@/components/brand/ChemLabLogo";
import { ExperimentSearchDialog } from "@/components/search/ExperimentSearchDialog";

type NavCopy = {
  experiments: string;
  exploreExperiments: string;
  students: string;
  teachers: string;
  about: string;
  myLearning: string;
  myClassrooms: string;
  saved: string;
  assignments: string;
  studentProgress: string;
  teachingResources: string;
  myProfile: string;
  myDashboard: string;
  studentDashboard: string;
  teacherDashboard: string;
  adminDashboard: string;
  studentAccount: string;
  teacherAccount: string;
  adminAccount: string;
  switchAccount: string;
  editProfile: string;
  accountSettings: string;
  logIn: string;
  signUp: string;
  logOut: string;
  student: string;
  teacher: string;
  menu: string;
};

const NAV_LABELS: Record<Locale, NavCopy> = {
  en: {
    experiments: "Experiments",
    exploreExperiments: "Explore Experiments",
    students: "Students",
    teachers: "Teachers",
    about: "About",
    myLearning: "My Learning",
    myClassrooms: "My Classrooms",
    saved: "Saved",
    assignments: "Assignments",
    studentProgress: "Student Progress",
    teachingResources: "Resources",
    myProfile: "My Profile",
    myDashboard: "Student Dashboard",
    studentDashboard: "Student Dashboard",
    teacherDashboard: "Teacher Dashboard",
    adminDashboard: "Admin Dashboard",
    studentAccount: "Student Account",
    teacherAccount: "Teacher Account",
    adminAccount: "Administrator Account",
    switchAccount: "Switch Account",
    editProfile: "Edit Profile",
    accountSettings: "Account Settings",
    logIn: "Log In",
    signUp: "Sign Up",
    logOut: "Log Out",
    student: "Student",
    teacher: "Teacher",
    menu: "Account menu",
  },
  ky: {
    experiments: "Тажрыйбалар",
    exploreExperiments: "Тажрыйбалар",
    students: "Окуучулар",
    teachers: "Мугалимдер",
    about: "Биз жөнүндө",
    myLearning: "Менин окуум",
    myClassrooms: "Класстарым",
    saved: "Сакталгандар",
    assignments: "Тапшырмалар",
    studentProgress: "Окуучулардын жыйынтыгы",
    teachingResources: "Материалдар",
    myProfile: "Менин профилим",
    myDashboard: "Окуучу панели",
    studentDashboard: "Окуучу панели",
    teacherDashboard: "Мугалим панели",
    adminDashboard: "Админ панели",
    studentAccount: "Окуучу аккаунту",
    teacherAccount: "Мугалим аккаунту",
    adminAccount: "Администратор аккаунту",
    switchAccount: "Башка аккаунтка өтүү",
    editProfile: "Профилди түзөтүү",
    accountSettings: "Аккаунт жөндөөлөрү",
    logIn: "Кирүү",
    signUp: "Катталуу",
    logOut: "Чыгуу",
    student: "Окуучу",
    teacher: "Мугалим",
    menu: "Аккаунт менюсу",
  },
  ru: {
    experiments: "Эксперименты",
    exploreExperiments: "Эксперименты",
    students: "Ученикам",
    teachers: "Учителям",
    about: "О проекте",
    myLearning: "Моё обучение",
    myClassrooms: "Мои классы",
    saved: "Сохранённые",
    assignments: "Задания",
    studentProgress: "Успеваемость",
    teachingResources: "Материалы",
    myProfile: "Мой профиль",
    myDashboard: "Панель ученика",
    studentDashboard: "Панель ученика",
    teacherDashboard: "Панель учителя",
    adminDashboard: "Панель администратора",
    studentAccount: "Аккаунт ученика",
    teacherAccount: "Аккаунт учителя",
    adminAccount: "Аккаунт администратора",
    switchAccount: "Сменить аккаунт",
    editProfile: "Редактировать профиль",
    accountSettings: "Настройки аккаунта",
    logIn: "Войти",
    signUp: "Регистрация",
    logOut: "Выйти",
    student: "Ученик",
    teacher: "Учитель",
    menu: "Меню аккаунта",
  },
};

function buildNav(locale: Locale, user: AuthUser | null, copy: NavCopy) {
  return [
    { href: `/${locale}/experiments`, label: copy.experiments },
    { href: `/${locale}/students`, label: copy.students },
    { href: `/${locale}/teachers`, label: copy.teachers },
    { href: `/${locale}/about`, label: copy.about },
  ];
}

function ProfileMenu({
  user,
  locale,
  copy,
  onSignOut,
  onSwitchAccount,
}: {
  user: AuthUser;
  locale: Locale;
  copy: NavCopy;
  onSignOut: () => void;
  onSwitchAccount: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dashboardHref =
    user.role === "teacher"
      ? `/${locale}/teacher-dashboard`
      : user.role === "admin"
      ? `/${locale}/admin`
      : `/${locale}/me`;

  const dashboardLabel =
    user.role === "teacher"
      ? copy.teacherDashboard
      : user.role === "admin"
      ? copy.adminDashboard
      : copy.studentDashboard;

  const roleBadgeLabel =
    user.role === "teacher"
      ? copy.teacherAccount
      : user.role === "admin"
      ? copy.adminAccount
      : copy.studentAccount;

  const parts = (user.name || "User").trim().split(" ");
  const shortName =
    parts.length > 1
      ? `${parts[0]} ${parts[parts.length - 1][0]}.`
      : user.name;

  const items = [
    {
      href: dashboardHref,
      label: dashboardLabel,
      icon: LayoutDashboard,
    },
    { href: `/${locale}/profile`, label: copy.myProfile, icon: User },
    { href: `/${locale}/profile/edit`, label: copy.editProfile, icon: Pencil },
    { href: `/${locale}/settings`, label: copy.accountSettings, icon: Settings },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={copy.menu}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full p-1 pl-1.5 pr-2 hover:bg-[#F8F7F4] transition-colors cursor-pointer"
      >
        <UserAvatar name={user.name} src={user.avatarUrl} size="sm" />
        <span className="text-sm font-bold text-[#142D40] hidden sm:inline-block">
          {shortName}
        </span>
        <ChevronDown
          className={`size-3.5 text-[#536574] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#142D40]/10 bg-white shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="flex items-center gap-3 px-3 py-3 border-b border-[#142D40]/8 mb-1">
            <UserAvatar name={user.name} src={user.avatarUrl} size="md" />
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#142D40] truncate">{user.name}</div>
              <div className="text-xs text-[#536574] truncate">{user.email}</div>
              <span className="mt-1 inline-block rounded-full bg-[#F8F7F4] border border-[#142D40]/10 px-2 py-0.5 text-[11px] font-semibold text-[#142D40]">
                {roleBadgeLabel}
              </span>
            </div>
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#142D40] hover:bg-[#F8F7F4]"
              >
                <Icon className="size-4 text-[#536574]" />
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSwitchAccount();
            }}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#142D40] hover:bg-[#F8F7F4] cursor-pointer"
          >
            <Users className="size-4 text-[#536574]" />
            {copy.switchAccount}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="mt-1 w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#142D40] hover:bg-[#F7DED0]/60 border-t border-[#142D40]/8 cursor-pointer"
          >
            <LogOut className="size-4 text-[#536574]" />
            {copy.logOut}
          </button>
        </div>
      )}
    </div>
  );
}

export function Header({
  locale,
}: {
  locale: Locale;
  nav?: Dictionary["nav"];
  banner?: Dictionary["banner"];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, hydrated, signOut } = useAuthStore();
  const copy = NAV_LABELS[locale];
  const navItems = buildNav(locale, user, copy);

  // Scroll listener for sticky translucency
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
    setMobileMenuOpen(false);
    router.push(`/${locale}`);
    router.refresh();
  }

  async function handleSwitchAccount() {
    await signOut();
    setMobileMenuOpen(false);
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-50 transition-all duration-200 ease-out">
        {/* LEVEL 1: SLIM DEEP NAVY UTILITY BAR (Desktop & Tablet) */}
        <div className="hidden sm:block bg-[#142D40] text-white border-b border-white/10">
          <div className="container-page flex h-9 items-center justify-between gap-4">
            {/* Left Brand Hint */}
            <div className="text-[11px] font-medium text-white/70 tracking-wide select-none">
              ChemLabᴷᴳ · Virtual Chemistry Lab & Curriculum
            </div>

            {/* Utility Controls (Right): Search + Language Selector */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Minimalist Search Trigger Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group inline-flex items-center gap-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 px-2.5 py-1 text-xs text-white/80 hover:text-white transition-all cursor-pointer"
                aria-label="Search experiments (Ctrl+K)"
              >
                <Search className="size-3 text-white/60 group-hover:text-[#38BDF8] transition-colors" />
                <span className="font-normal text-[11px] text-white/75 group-hover:text-white transition-colors">
                  {locale === "ky"
                    ? "Тажрыйбаларды издөө..."
                    : locale === "ru"
                    ? "Поиск экспериментов..."
                    : "Search experiments..."}
                </span>
                <kbd className="rounded bg-white/10 group-hover:bg-white/15 border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/60 group-hover:text-white/90 transition-colors">
                  Ctrl K
                </kbd>
              </button>

              <div className="h-3 w-px bg-white/20" aria-hidden="true" />

              {/* Language Selector (Clean Divider Theme) */}
              <LanguageSwitcher currentLocale={locale} variant="dark" />
            </div>
          </div>
        </div>

        {/* LEVEL 2: MAIN WHITE NAVIGATION BAR */}
        <div
          className={`transition-all duration-200 ease-out ${
            scrolled
              ? "bg-white/95 backdrop-blur-md border-b border-[#142D40]/10 shadow-xs"
              : "bg-white border-b border-[#142D40]/8 shadow-none"
          }`}
        >
          <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4 lg:gap-8">
            {/* Far Left: Official ChemLab KG Logo */}
            <div className="shrink-0 flex items-center">
              <ChemLabLogo href={`/${locale}`} size="md" />
            </div>

            {/* Right Group: Right-Aligned Navigation Links -> Divider -> Auth Controls */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              {/* Primary Navigation Links */}
              <nav className="flex items-center gap-1 xl:gap-2" aria-label="Primary">
                {navItems.map((item) => {
                  const baseHref = item.href.split("#")[0];
                  const isExperiments = baseHref === `/${locale}/experiments`;
                  const isCurrentExperiments = pathname.startsWith(
                    `/${locale}/experiments`
                  );
                  const isTeachers = baseHref === `/${locale}/teachers`;
                  const isCurrentTeachers =
                    pathname.startsWith(`/${locale}/teachers`) ||
                    pathname.startsWith(`/${locale}/teacher-dashboard`);
                  const isExact = pathname === baseHref;
                  const isChild =
                    baseHref !== `/${locale}` &&
                    pathname.startsWith(baseHref + "/");
                  const isActive = isExperiments
                    ? isCurrentExperiments
                    : isTeachers
                    ? isCurrentTeachers
                    : !item.href.includes("#") && (isExact || isChild);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative px-3.5 py-2 text-sm font-semibold transition-colors duration-150 inline-flex items-center justify-center ${
                        isActive
                          ? "text-[#142D40]"
                          : "text-[#536574] hover:text-[#142D40]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-[#2563EB] shadow-xs"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Clean separator */}
              <div className="h-5 w-px bg-[#142D40]/12" aria-hidden="true" />

              {/* Authentication Controls (Flicker-Free with Hydration Check) */}
              {!hydrated ? (
                <div className="h-9 w-28 rounded-full bg-slate-100 animate-pulse" aria-hidden="true" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  {/* Notification Bell */}
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="relative inline-flex size-9 items-center justify-center rounded-full hover:bg-[#F8F7F4] text-[#142D40] transition-colors cursor-pointer"
                  >
                    <Bell className="size-4.5" />
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#2563EB]" />
                  </button>

                  <ProfileMenu
                    user={user}
                    locale={locale}
                    copy={copy}
                    onSignOut={handleSignOut}
                    onSwitchAccount={handleSwitchAccount}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/login`}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-[#142D40] hover:bg-[#F8F7F4] transition-colors"
                  >
                    {copy.logIn}
                  </Link>
                  <Link
                    href={`/${locale}/signup`}
                    className="rounded-full bg-[#087F8C] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#142D40] transition-colors shadow-xs"
                  >
                    {copy.signUp}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Controls (Right) */}
            <div className="lg:hidden flex items-center gap-2 shrink-0">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search experiments"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[#142D40]/12 bg-[#F8F7F4] hover:bg-white text-[#142D40] cursor-pointer transition-colors"
              >
                <Search className="size-4 text-[#087F8C]" />
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label="Toggle navigation menu"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[#142D40]/12 bg-white text-[#142D40] cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="lg:hidden border-t border-[#142D40]/10 bg-white px-4 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150"
          >
            {/* Search bar in mobile drawer */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 px-4 py-3 text-sm font-medium text-[#536574] hover:text-[#142D40] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Search className="size-4 text-[#087F8C]" />
                <span>
                  {locale === "ky"
                    ? "Тажрыйбаларды издөө..."
                    : locale === "ru"
                    ? "Поиск экспериментов..."
                    : "Search experiments..."}
                </span>
              </span>
              <kbd className="rounded border border-[#142D40]/15 bg-white px-2 py-0.5 font-mono text-[11px] text-[#536574]">
                Ctrl+K
              </kbd>
            </button>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navItems.map((item) => {
                const baseHref = item.href.split("#")[0];
                const isExperiments = baseHref === `/${locale}/experiments`;
                const isCurrentExperiments = pathname.startsWith(
                  `/${locale}/experiments`
                );
                const isExact = pathname === baseHref;
                const isChild =
                  baseHref !== `/${locale}` &&
                  pathname.startsWith(baseHref + "/");
                const isActive = isExperiments
                  ? isCurrentExperiments
                  : !item.href.includes("#") && (isExact || isChild);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-[#F8F7F4] text-[#142D40] border-l-4 border-[#2563EB]"
                        : "text-[#536574] hover:bg-[#F8F7F4] hover:text-[#142D40]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="size-2 rounded-full bg-[#2563EB]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Language Switcher */}
            <div className="pt-2 border-t border-[#142D40]/8 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#536574]">
                {locale === "ky" ? "Тил тандоо:" : locale === "ru" ? "Язык:" : "Language:"}
              </span>
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {/* Mobile Auth Actions (Flicker-Free with Hydration Check) */}
            <div className="pt-4 border-t border-[#142D40]/8">
              {!hydrated ? (
                <div className="h-11 w-full rounded-xl bg-slate-100 animate-pulse" />
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={
                        user.role === "teacher"
                          ? `/${locale}/teacher-dashboard`
                          : user.role === "admin"
                          ? `/${locale}/admin`
                          : `/${locale}/me`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 min-w-0"
                    >
                      <UserAvatar name={user.name} src={user.avatarUrl} size="sm" />
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-[#142D40] block truncate">
                          {user.name}
                        </span>
                        <span className="text-[11px] text-[#536574] block">
                          {user.role === "teacher"
                            ? copy.teacherAccount
                            : user.role === "admin"
                            ? copy.adminAccount
                            : copy.studentAccount}
                        </span>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8F7F4] px-3.5 py-2 text-xs font-semibold text-[#142D40] cursor-pointer"
                    >
                      <LogOut className="size-3.5" />
                      {copy.logOut}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-[#536574] hover:text-[#142D40] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Users className="size-3.5" />
                    <span>{copy.switchAccount}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center rounded-xl border border-[#142D40]/12 py-3 text-sm font-semibold text-[#142D40]"
                  >
                    {copy.logIn}
                  </Link>
                  <Link
                    href={`/${locale}/signup`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center rounded-xl bg-[#087F8C] py-3 text-sm font-bold text-white shadow-xs"
                  >
                    {copy.signUp}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Experiment Search Dialog */}
      <ExperimentSearchDialog
        locale={locale}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
