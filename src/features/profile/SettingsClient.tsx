"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Globe, Shield, LogOut, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { PublicProfile, ProfileLocale } from "@/features/profile/profile-store";
import type { Locale } from "@/i18n/config";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { publishAuthUser } from "@/features/auth/auth-store";

interface SettingsClientProps {
  profile: PublicProfile;
  locale: Locale;
}

export function SettingsClient({ profile, locale }: SettingsClientProps) {
  const router = useRouter();

  // Language settings state
  const [selectedLocale, setSelectedLocale] = useState<ProfileLocale>(profile.preferredLocale);
  const [isUpdatingLocale, setIsUpdatingLocale] = useState(false);
  const [localeSuccess, setLocaleSuccess] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  // Logout state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const t = {
    title: locale === "ky" ? "Аккаунттун жөндөөлөрү" : locale === "ru" ? "Настройки аккаунта" : "Account Settings",
    subtitle: locale === "ky" ? "Сырсөздү алмаштыруу, тилди тандоо жана коопсуздук." : locale === "ru" ? "Смена пароля, выбор языка и безопасность." : "Password, language preferences, and account security.",
    backToProfile: locale === "ky" ? "Профилге кайтуу" : locale === "ru" ? "Назад в профиль" : "Back to Profile",
    languageSection: locale === "ky" ? "Тил жана регион" : locale === "ru" ? "Язык и регион" : "Language & Region",
    languageDesc: locale === "ky" ? "Платформанын негизги тилин тандаңыз." : locale === "ru" ? "Выберите основной язык интерфейса." : "Choose your preferred interface language.",
    saveLanguage: locale === "ky" ? "Тилди сактоо" : locale === "ru" ? "Сохранить язык" : "Save Language",
    securitySection: locale === "ky" ? "Коопсуздук жана сырсөз" : locale === "ru" ? "Безопасность и пароль" : "Security & Password",
    currentPassword: locale === "ky" ? "Учурдагы сырсөз" : locale === "ru" ? "Текущий пароль" : "Current Password",
    newPassword: locale === "ky" ? "Жаңы сырсөз" : locale === "ru" ? "Новый пароль" : "New Password",
    confirmPassword: locale === "ky" ? "Жаңы сырсөздү кайталаңыз" : locale === "ru" ? "Повторите новый пароль" : "Confirm New Password",
    updatePasswordBtn: locale === "ky" ? "Сырсөздү жаңылоо" : locale === "ru" ? "Обновить пароль" : "Update Password",
    accountDetails: locale === "ky" ? "Аккаунттун маалыматы" : locale === "ru" ? "Данные учётной записи" : "Account Details",
    emailLabel: locale === "ky" ? "Электрондук дарек" : locale === "ru" ? "Электронный адрес" : "Email Address",
    roleLabel: locale === "ky" ? "Ролу" : locale === "ru" ? "Роль" : "Role",
    logoutBtn: locale === "ky" ? "Аккаунттан чыгуу" : locale === "ru" ? "Выйти из системы" : "Sign Out",
  };

  async function handleUpdateLanguage(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdatingLocale(true);
    setLocaleSuccess(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredLocale: selectedLocale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update language");
      }

      publishAuthUser({
        ...profile,
        name: profile.displayName,
        preferredLocale: selectedLocale,
        avatarUrl: profile.avatarUrl ?? undefined,
      });

      setLocaleSuccess(locale === "ky" ? "Тил ийгиликтүү өзгөртүлдү!" : locale === "ru" ? "Язык успешно изменён!" : "Language updated successfully!");

      if (selectedLocale !== locale) {
        setTimeout(() => {
          const nextSettingsUrl =
            profile.role === "teacher"
              ? `/${selectedLocale}/teacher-dashboard/settings`
              : `/${selectedLocale}/me/settings`;
          router.push(nextSettingsUrl);
          router.refresh();
        }, 500);
      }
    } catch {
      // Ignore
    } finally {
      setIsUpdatingLocale(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (newPassword.length < 6) {
      setPwdError(
        locale === "ky"
          ? "Жаңы сырсөз 6 белгиден кем эмес болушу керек."
          : locale === "ru"
          ? "Новый пароль должен содержать не менее 6 символов."
          : "New password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError(
        locale === "ky"
          ? "Сырсөздөр дал келген жок."
          : locale === "ru"
          ? "Пароли не совпадают."
          : "Passwords do not match."
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setPwdSuccess(
        locale === "ky"
          ? "Сырсөз ийгиликтүү алмаштырылды!"
          : locale === "ru"
          ? "Пароль успешно изменён!"
          : "Password updated successfully!"
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      setPwdError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue cleanup
    } finally {
      publishAuthUser(null);
      router.push(`/${locale}/login`);
      router.refresh();
    }
  }

  return (
    <div className="w-full">
      <FullWidthSection tone="warm" size="compact" className="border-b border-[#142D40]/8">
        <div className="space-y-2">
          <Link
            href={
              profile.role === "teacher"
                ? `/${locale}/teacher-dashboard/profile`
                : `/${locale}/me/profile`
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#536574] hover:text-[#142D40] transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t.backToProfile}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D40] tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-[#536574] max-w-xl">{t.subtitle}</p>
        </div>
      </FullWidthSection>

      <FullWidthSection tone="white" size="default">
        <div className="max-w-2xl space-y-8">
          {/* Language Preference Card */}
          <form onSubmit={handleUpdateLanguage} className="rounded-3xl border border-[#142D40]/10 bg-white p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <Globe className="size-5 text-[#087F8C]" />
              <h2 className="text-base font-bold text-[#142D40]">{t.languageSection}</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#536574]">{t.languageDesc}</p>

            {localeSuccess && (
              <div className="rounded-2xl bg-[#087F8C]/10 border border-[#087F8C]/30 p-3.5 flex items-center gap-2.5 text-xs font-medium text-[#087F8C]">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{localeSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: "ky", label: "Кыргызча", desc: "Kyrgyz" },
                { code: "ru", label: "Русский", desc: "Russian" },
                { code: "en", label: "English", desc: "English" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => setSelectedLocale(item.code as ProfileLocale)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    selectedLocale === item.code
                      ? "border-[#087F8C] bg-[#DCECF6]/30 text-[#142D40] font-bold"
                      : "border-[#142D40]/10 bg-[#F8F7F4] text-[#536574] hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-[#536574]">{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingLocale || selectedLocale === profile.preferredLocale}
                className="inline-flex items-center gap-2 rounded-full bg-[#142D40] hover:bg-[#087F8C] px-5 py-2.5 text-xs font-semibold text-white transition-colors disabled:opacity-40"
              >
                {isUpdatingLocale && <Loader2 className="size-3.5 animate-spin" />}
                {t.saveLanguage}
              </button>
            </div>
          </form>

          {/* Security & Password Card */}
          <form onSubmit={handleChangePassword} className="rounded-3xl border border-[#142D40]/10 bg-white p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <Lock className="size-5 text-[#087F8C]" />
              <h2 className="text-base font-bold text-[#142D40]">{t.securitySection}</h2>
            </div>

            {pwdError && (
              <div className="rounded-2xl bg-[#D9534F]/10 border border-[#D9534F]/30 p-3.5 flex items-start gap-2.5 text-xs text-[#D9534F]">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="rounded-2xl bg-[#087F8C]/10 border border-[#087F8C]/30 p-3.5 flex items-start gap-2.5 text-xs text-[#087F8C]">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#142D40]">
                  {t.currentPassword}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-2.5 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#142D40]">
                    {t.newPassword}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-2.5 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#142D40]">
                    {t.confirmPassword}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-2.5 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword}
                className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#066670] px-5 py-2.5 text-xs font-semibold text-white transition-colors disabled:opacity-40"
              >
                {isChangingPassword && <Loader2 className="size-3.5 animate-spin" />}
                {t.updatePasswordBtn}
              </button>
            </div>
          </form>

          {/* Account Details & Danger/Logout */}
          <div className="rounded-3xl border border-[#142D40]/10 bg-white p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <Shield className="size-5 text-[#087F8C]" />
              <h2 className="text-base font-bold text-[#142D40]">{t.accountDetails}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F8F7F4]">
                <span className="text-[#536574]">{t.emailLabel}</span>
                <div className="font-semibold text-[#142D40] mt-0.5">{profile.email}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F7F4]">
                <span className="text-[#536574]">{t.roleLabel}</span>
                <div className="font-semibold text-[#142D40] mt-0.5 capitalize">{profile.role}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#142D40]/8 flex items-center justify-between">
              <span className="text-xs text-[#536574]">
                {locale === "ky" ? "Бул түзмөктө сессияны аяктоо" : locale === "ru" ? "Завершить сеанс на этом устройстве" : "End session on this device"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D9534F]/30 px-4 py-2 text-xs font-semibold text-[#D9534F] hover:bg-[#D9534F]/10 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? <Loader2 className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
                {t.logoutBtn}
              </button>
            </div>
          </div>
        </div>
      </FullWidthSection>
    </div>
  );
}