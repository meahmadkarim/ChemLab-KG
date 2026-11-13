"use client";

import React from "react";
import Link from "next/link";
import { User, School, Globe, Mail, Calendar, Edit3, Settings, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import type { PublicProfile } from "@/features/profile/profile-store";
import type { Locale } from "@/i18n/config";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { FullWidthSection } from "@/components/layout/FullWidthSection";

interface ProfileClientProps {
  profile: PublicProfile;
  locale: Locale;
}

export function ProfileClient({ profile, locale }: ProfileClientProps) {
  const isStudent = profile.role === "student";

  const t = {
    editProfile: locale === "ky" ? "Профилди өзгөртүү" : locale === "ru" ? "Редактировать профиль" : "Edit Profile",
    settings: locale === "ky" ? "Жөндөөлөр" : locale === "ru" ? "Настройки" : "Account Settings",
    roleStudent: locale === "ky" ? "Окуучу" : locale === "ru" ? "Ученик" : "Student",
    roleTeacher: locale === "ky" ? "Мугалим" : locale === "ru" ? "Учитель" : "Teacher",
    aboutMe: locale === "ky" ? "Мен жөнүндө" : locale === "ru" ? "Обо мне" : "About",
    noBio: locale === "ky" ? "Маалымат кошула элек." : locale === "ru" ? "Информация пока не добавлена." : "No bio added yet.",
    school: locale === "ky" ? "Мектеп же окуу жай" : locale === "ru" ? "Школа или лицей" : "School or Institution",
    noSchool: locale === "ky" ? "Көрсөтүлгөн эмес" : locale === "ru" ? "Не указано" : "Not specified",
    preferredLanguage: locale === "ky" ? "Тандалган тил" : locale === "ru" ? "Предпочитаемый язык" : "Preferred Language",
    email: locale === "ky" ? "Электрондук почта" : locale === "ru" ? "Электронная почта" : "Email",
    joined: locale === "ky" ? "Катталган убактысы" : locale === "ru" ? "Дата регистрации" : "Member Since",
    studentDashboardLink: locale === "ky" ? "Менин прогрессим" : locale === "ru" ? "Мой прогресс" : "My Learning Dashboard",
    teacherDashboardLink: locale === "ky" ? "Мугалимдин панели" : locale === "ru" ? "Панель учителя" : "Teacher Dashboard",
    demoAccount: locale === "ky" ? "Демо аккаунт" : locale === "ru" ? "Демо-аккаунт" : "Demo Account",
  };

  const languageNames: Record<string, string> = {
    ky: "Кыргызча (Kyrgyz)",
    ru: "Русский (Russian)",
    en: "English",
  };

  const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "—";

  return (
    <div className="w-full">
      {/* Header Band */}
      <FullWidthSection tone="warm" size="compact" className="border-b border-[#142D40]/8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <UserAvatar
              user={{
                name: profile.displayName,
                avatarUrl: profile.avatarUrl ?? undefined,
                role: profile.role,
              }}
              size="xl"
              className="ring-4 ring-white shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D40] tracking-tight">
                  {profile.displayName}
                </h1>
                <span className="inline-flex items-center rounded-full bg-[#142D40] px-3 py-0.5 text-xs font-semibold text-white">
                  {isStudent ? t.roleStudent : t.roleTeacher}
                </span>
                {profile.isDemo && (
                  <span className="inline-flex items-center rounded-full bg-[#F2B544]/30 px-2.5 py-0.5 text-xs font-semibold text-[#142D40]">
                    {t.demoAccount}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#536574]">{profile.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={
                isStudent
                  ? `/${locale}/me/profile/edit`
                  : `/${locale}/teacher-dashboard/profile/edit`
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#066670]"
            >
              <Edit3 className="size-4" />
              {t.editProfile}
            </Link>
            <Link
              href={
                isStudent
                  ? `/${locale}/me/settings`
                  : `/${locale}/teacher-dashboard/settings`
              }
              className="inline-flex items-center gap-2 rounded-full bg-white border border-[#142D40]/15 px-4 py-2.5 text-sm font-semibold text-[#142D40] transition-colors hover:bg-[#F8F7F4]"
            >
              <Settings className="size-4" />
              {t.settings}
            </Link>
          </div>
        </div>
      </FullWidthSection>

      {/* Main Content Details */}
      <FullWidthSection tone="white" size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Bio Card */}
            <div className="rounded-3xl border border-[#142D40]/10 bg-white p-6 sm:p-7 space-y-3">
              <h2 className="text-lg font-bold text-[#142D40] flex items-center gap-2">
                <User className="size-4 text-[#087F8C]" />
                {t.aboutMe}
              </h2>
              <p className="text-sm sm:text-base text-[#536574] leading-relaxed whitespace-pre-wrap">
                {profile.bio || t.noBio}
              </p>
            </div>

            {/* Account Information Card */}
            <div className="rounded-3xl border border-[#142D40]/10 bg-white p-6 sm:p-7 space-y-5">
              <h2 className="text-lg font-bold text-[#142D40]">
                {locale === "ky" ? "Профиль маалыматы" : locale === "ru" ? "Сведения о профиле" : "Profile Information"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F7F4]">
                  <School className="size-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-[#536574]">{t.school}</div>
                    <div className="text-sm font-semibold text-[#142D40] mt-0.5">
                      {profile.school || t.noSchool}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F7F4]">
                  <Globe className="size-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-[#536574]">{t.preferredLanguage}</div>
                    <div className="text-sm font-semibold text-[#142D40] mt-0.5">
                      {languageNames[profile.preferredLocale] ?? profile.preferredLocale}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F7F4]">
                  <Mail className="size-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-[#536574]">{t.email}</div>
                    <div className="text-sm font-semibold text-[#142D40] mt-0.5 truncate max-w-[200px]">
                      {profile.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F7F4]">
                  <Calendar className="size-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-[#536574]">{t.joined}</div>
                    <div className="text-sm font-semibold text-[#142D40] mt-0.5">
                      {joinDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Role Navigation Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-[#142D40]/10 bg-[#DCECF6]/40 p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                {isStudent ? (
                  <BookOpen className="size-5 text-[#087F8C]" />
                ) : (
                  <GraduationCap className="size-5 text-[#087F8C]" />
                )}
                <h3 className="text-base font-bold text-[#142D40]">
                  {isStudent ? t.studentDashboardLink : t.teacherDashboardLink}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#536574] leading-relaxed">
                {isStudent
                  ? (locale === "ky"
                      ? "Тажрыйбаларды көрүү, тесттерди кайталоо жана өз прогрессиңизди байкоо үчүн окуу панелине өтүңүз."
                      : locale === "ru"
                      ? "Перейдите в панель обучения, чтобы просматривать опыты, тесты и отслеживать свой прогресс."
                      : "Access your personalized learning path, quiz scores, and saved experiments.")
                  : (locale === "ky"
                      ? "Класстарды башкаруу, окуучулардын жыйынтыктарын көрүү жана тапшырмаларды түзүү үчүн мугалимдер панелине өтүңүз."
                      : locale === "ru"
                      ? "Управляйте классами, кодами доступа и результатами учеников в панели учителя."
                      : "Manage classrooms, access codes, and student completion metrics.")}
              </p>

              <Link
                href={isStudent ? `/${locale}/me` : `/${locale}/teacher-dashboard`}
                className="inline-flex items-center justify-between w-full rounded-2xl bg-white border border-[#142D40]/10 px-4 py-3 text-sm font-semibold text-[#142D40] hover:border-[#087F8C]/40 hover:text-[#087F8C] transition-all"
              >
                <span>{locale === "ky" ? "Панелге өтүү" : locale === "ru" ? "Открыть панель" : "Open Dashboard"}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </FullWidthSection>
    </div>
  );
}