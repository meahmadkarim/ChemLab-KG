"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, LayoutDashboard, BookOpen } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { useAuthStore } from "@/features/auth/auth-store";

// ============================================================================
// 1. TEACHERS PAGE HERO CTAS
// ============================================================================
interface TeacherPageHeroCtasProps {
  locale: Locale;
  createAccountLabel: string;
  exploreResourcesLabel: string;
}

export function TeacherPageHeroCtas({
  locale,
  createAccountLabel,
  exploreResourcesLabel,
}: TeacherPageHeroCtasProps) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/signup?role=teacher`}
          className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          {createAccountLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          {exploreResourcesLabel}
        </Link>
      </div>
    );
  }

  // State C: Teacher
  if (user.role === "teacher") {
    const primaryLabel =
      locale === "ky" ? "Мугалим панели" : locale === "ru" ? "Панель учителя" : "Teacher Dashboard";
    const secondaryLabel =
      locale === "ky" ? "Окутуу материалдары" : locale === "ru" ? "Учебные материалы" : "Teaching Resources";

    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/teacher-dashboard`}
          className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{primaryLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/${locale}/teacher-dashboard/resources`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>{secondaryLabel}</span>
        </Link>
      </div>
    );
  }

  // State D: Admin
  if (user.role === "admin") {
    const primaryLabel =
      locale === "ky" ? "Админ панели" : locale === "ru" ? "Панель администратора" : "Admin Dashboard";
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/admin`}
          className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{primaryLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/${locale}/teacher-dashboard/resources`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          {exploreResourcesLabel}
        </Link>
      </div>
    );
  }

  // State B: Student
  const studentPrimary =
    locale === "ky" ? "Менин окуум" : locale === "ru" ? "Моё обучение" : "My Learning";
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <Link
        href={`/${locale}/me/learning`}
        className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>{studentPrimary}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href={`/${locale}/experiments`}
        className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
      >
        {exploreResourcesLabel}
      </Link>
    </div>
  );
}

// ============================================================================
// 2. TEACHERS PAGE BOTTOM CTA
// ============================================================================
interface TeacherPageBottomCtasProps {
  locale: Locale;
  createAccountLabel: string;
}

export function TeacherPageBottomCtas({
  locale,
  createAccountLabel,
}: TeacherPageBottomCtasProps) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return (
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link
          href={`/${locale}/signup?role=teacher`}
          className="rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-sm sm:text-base font-bold transition-colors shadow-sm"
        >
          {createAccountLabel}
        </Link>
        <Link
          href={`/${locale}/teacher-dashboard`}
          className="rounded-full bg-white hover:bg-[#F8F7F4] text-[#142D40] border border-[#142D40]/15 px-6 py-4 text-sm sm:text-base font-semibold transition-colors"
        >
          {locale === "ky" ? "Мугалим панели" : locale === "ru" ? "Панель учителя" : "Open Teacher Dashboard"}
        </Link>
      </div>
    );
  }

  if (user.role === "teacher") {
    return (
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link
          href={`/${locale}/teacher-dashboard`}
          className="rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-sm sm:text-base font-bold transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span>{locale === "ky" ? "Мугалим панели" : locale === "ru" ? "Панель учителя" : "Open Teacher Dashboard"}</span>
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={`/${locale}/teacher-dashboard/resources`}
          className="rounded-full bg-white hover:bg-[#F8F7F4] text-[#142D40] border border-[#142D40]/15 px-6 py-4 text-sm sm:text-base font-semibold transition-colors"
        >
          {locale === "ky" ? "Материалдар" : locale === "ru" ? "Учебные материалы" : "Teaching Resources"}
        </Link>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link
          href={`/${locale}/admin`}
          className="rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-sm sm:text-base font-bold transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <span>{locale === "ky" ? "Админ панели" : locale === "ru" ? "Панель администратора" : "Admin Dashboard"}</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  // Student
  return (
    <div className="flex flex-wrap items-center gap-3 shrink-0">
      <Link
        href={`/${locale}/me`}
        className="rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-sm sm:text-base font-bold transition-colors shadow-sm inline-flex items-center gap-2"
      >
        <span>{locale === "ky" ? "Менин окуум" : locale === "ru" ? "Моё обучение" : "My Learning"}</span>
        <ArrowRight className="size-4" />
      </Link>
      <Link
        href={`/${locale}/experiments`}
        className="rounded-full bg-white hover:bg-[#F8F7F4] text-[#142D40] border border-[#142D40]/15 px-6 py-4 text-sm sm:text-base font-semibold transition-colors"
      >
        {locale === "ky" ? "Тажрыйбалар" : locale === "ru" ? "Эксперименты" : "Explore Experiments"}
      </Link>
    </div>
  );
}

// ============================================================================
// 3. STUDENTS PAGE HERO CTAS
// ============================================================================
interface StudentPageHeroCtasProps {
  locale: Locale;
  exploreBtnLabel: string;
  startLearningBtnLabel: string;
}

export function StudentPageHeroCtas({
  locale,
  exploreBtnLabel,
  startLearningBtnLabel,
}: StudentPageHeroCtasProps) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <Play className="w-4 h-4 fill-current" />
          {exploreBtnLabel}
        </Link>
        <Link
          href={`/${locale}/signup?role=student`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          {startLearningBtnLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Student
  if (user.role === "student") {
    const primaryLabel =
      locale === "ky" ? "Менин окуум" : locale === "ru" ? "Моё обучение" : "My Learning";
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/me/learning`}
          className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{primaryLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{exploreBtnLabel}</span>
        </Link>
      </div>
    );
  }

  // Teacher
  if (user.role === "teacher") {
    const primaryLabel =
      locale === "ky" ? "Мугалим панели" : locale === "ru" ? "Панель учителя" : "Teacher Dashboard";
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/teacher-dashboard`}
          className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{primaryLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{exploreBtnLabel}</span>
        </Link>
      </div>
    );
  }

  // Admin
  const adminLabel =
    locale === "ky" ? "Админ панели" : locale === "ru" ? "Панель администратора" : "Admin Dashboard";
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <Link
        href={`/${locale}/admin`}
        className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>{adminLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href={`/${locale}/experiments`}
        className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>{exploreBtnLabel}</span>
      </Link>
    </div>
  );
}

// ============================================================================
// 4. HOMEPAGE HERO CTAS
// ============================================================================
interface HomePageHeroCtasProps {
  locale: Locale;
  primaryCta: string;
  secondaryCta: string;
}

export function HomePageHeroCtas({
  locale,
  primaryCta,
  secondaryCta,
}: HomePageHeroCtasProps) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <Play className="size-4 fill-current" />
          {primaryCta}
        </Link>
        <Link
          href={`/${locale}/teachers`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          {secondaryCta}
        </Link>
      </div>
    );
  }

  // Student
  if (user.role === "student") {
    const continueLabel =
      locale === "ky" ? "Окууну улантуу" : locale === "ru" ? "Продолжить обучение" : "Continue Learning";
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/me`}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <Play className="size-4 fill-current" />
          <span>{continueLabel}</span>
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          {primaryCta}
        </Link>
      </div>
    );
  }

  // Teacher
  if (user.role === "teacher") {
    const teacherLabel =
      locale === "ky" ? "Мугалим панели" : locale === "ru" ? "Панель учителя" : "Teacher Dashboard";
    return (
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/${locale}/teacher-dashboard`}
          className="inline-flex items-center gap-2.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
        >
          <LayoutDashboard className="size-4" />
          <span>{teacherLabel}</span>
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href={`/${locale}/experiments`}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
        >
          {primaryCta}
        </Link>
      </div>
    );
  }

  // Admin
  const adminLabel =
    locale === "ky" ? "Админ панели" : locale === "ru" ? "Панель администратора" : "Admin Dashboard";
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <Link
        href={`/${locale}/admin`}
        className="inline-flex items-center gap-2.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white px-7 py-4 text-base font-bold transition-colors shadow-md"
      >
        <LayoutDashboard className="size-4" />
        <span>{adminLabel}</span>
        <ArrowRight className="size-4" />
      </Link>
      <Link
        href={`/${locale}/experiments`}
        className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 px-7 py-4 text-base font-semibold backdrop-blur-xs transition-colors"
      >
        {primaryCta}
      </Link>
    </div>
  );
}

// ============================================================================
// 5. HOMEPAGE BOTTOM TEACHER SECTION CTA
// ============================================================================
interface HomePageTeacherCtaProps {
  locale: Locale;
  defaultLabel: string;
}

export function HomePageTeacherCta({
  locale,
  defaultLabel,
}: HomePageTeacherCtaProps) {
  const { user, hydrated } = useAuthStore();

  if (!hydrated || !user) {
    return (
      <Link
        href={`/${locale}/teachers`}
        className="inline-flex items-center gap-2 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white px-7 py-3.5 text-sm font-bold transition-colors shadow-sm"
      >
        <span>{defaultLabel}</span>
        <ArrowRight className="size-4" />
      </Link>
    );
  }

  if (user.role === "teacher") {
    return (
      <Link
        href={`/${locale}/teacher-dashboard`}
        className="inline-flex items-center gap-2 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white px-7 py-3.5 text-sm font-bold transition-colors shadow-sm"
      >
        <span>{locale === "ky" ? "Мугалим панели" : locale === "ru" ? "Панель учителя" : "Teacher Dashboard"}</span>
        <ArrowRight className="size-4" />
      </Link>
    );
  }

  if (user.role === "admin") {
    return (
      <Link
        href={`/${locale}/admin`}
        className="inline-flex items-center gap-2 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white px-7 py-3.5 text-sm font-bold transition-colors shadow-sm"
      >
        <span>{locale === "ky" ? "Админ панели" : locale === "ru" ? "Панель администратора" : "Admin Dashboard"}</span>
        <ArrowRight className="size-4" />
      </Link>
    );
  }

  // Student
  return (
    <Link
      href={`/${locale}/me`}
      className="inline-flex items-center gap-2 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white px-7 py-3.5 text-sm font-bold transition-colors shadow-sm"
    >
      <span>{locale === "ky" ? "Менин окуум" : locale === "ru" ? "Моё обучение" : "My Learning"}</span>
      <ArrowRight className="size-4" />
    </Link>
  );
}
