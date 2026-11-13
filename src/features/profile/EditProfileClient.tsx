"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, Trash2, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { PublicProfile, ProfileLocale } from "@/features/profile/profile-store";
import type { Locale } from "@/i18n/config";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { publishAuthUser } from "@/features/auth/auth-store";

interface EditProfileClientProps {
  profile: PublicProfile;
  locale: Locale;
}

export function EditProfileClient({ profile, locale }: EditProfileClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [school, setSchool] = useState(profile.school);
  const [bio, setBio] = useState(profile.bio);
  const [preferredLocale, setPreferredLocale] = useState<ProfileLocale>(profile.preferredLocale);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const t = {
    title: locale === "ky" ? "Профилди өзгөртүү" : locale === "ru" ? "Редактирование профиля" : "Edit Profile",
    subtitle: locale === "ky" ? "Аты-жөнүңүздү, сүрөтүңүздү жана окуу жайыңызды жаңыртыңыз." : locale === "ru" ? "Обновите имя, фото и учебное заведение." : "Update your display name, avatar, and school information.",
    backToProfile: locale === "ky" ? "Профилге кайтуу" : locale === "ru" ? "Назад в профиль" : "Back to Profile",
    avatarSection: locale === "ky" ? "Профиль сүрөтү" : locale === "ru" ? "Фотография профиля" : "Profile Avatar",
    uploadBtn: locale === "ky" ? "Сүрөт жүктөө" : locale === "ru" ? "Загрузить фото" : "Upload Image",
    removeBtn: locale === "ky" ? "Өчүрүү" : locale === "ru" ? "Удалить фото" : "Remove Avatar",
    avatarHint: locale === "ky" ? "PNG, JPG же WebP (макс. 2 МБ)." : locale === "ru" ? "PNG, JPG или WebP (макс. 2 МБ)." : "PNG, JPG, or WebP (max 2 MB).",
    displayNameLabel: locale === "ky" ? "Көрүнүүчү аты-жөнү" : locale === "ru" ? "Отображаемое имя" : "Display Name",
    schoolLabel: locale === "ky" ? "Мектеп же окуу жай" : locale === "ru" ? "Школа или лицей" : "School or Institution",
    bioLabel: locale === "ky" ? "Кыскача маалымат" : locale === "ru" ? "О себе" : "Short Bio",
    languageLabel: locale === "ky" ? "Интерфейстин тили" : locale === "ru" ? "Язык интерфейса" : "Preferred Language",
    saveBtn: locale === "ky" ? "Өзгөртүүлөрдү сактоо" : locale === "ru" ? "Сохранить изменения" : "Save Changes",
    cancelBtn: locale === "ky" ? "Жокко чыгаруу" : locale === "ru" ? "Отмена" : "Cancel",
    savedSuccess: locale === "ky" ? "Профиль ийгиликтүү жаңыртылды!" : locale === "ru" ? "Профиль успешно обновлён!" : "Profile updated successfully!",
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg(
        locale === "ky"
          ? "Сүрөттүн көлөмү 2 МБ дан ашпашы керек."
          : locale === "ru"
          ? "Размер изображения не должен превышать 2 МБ."
          : "Image size must not exceed 2 MB."
      );
      return;
    }

    setAvatarFile(file);
    setAvatarRemoved(false);
    setErrorMsg(null);

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  }

  function handleRemoveAvatar() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Handle Avatar upload or removal if changed
      let finalAvatarUrl = avatarPreview;

      if (avatarRemoved) {
        const res = await fetch("/api/profile/avatar", { method: "DELETE" });
        if (!res.ok) {
          throw new Error("Failed to remove avatar");
        }
        finalAvatarUrl = null;
      } else if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const res = await fetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to upload avatar");
        }
        finalAvatarUrl = data.avatarUrl;
      }

      // 2. Save text profile changes
      const profileRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          school,
          bio,
          preferredLocale,
        }),
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok || !profileData.ok) {
        throw new Error(profileData.error || "Failed to save profile");
      }

      // 3. Update client-side session cache for header & components
      publishAuthUser({
        id: profile.id,
        name: displayName,
        email: profile.email,
        role: profile.role,
        school: school || undefined,
        avatarUrl: finalAvatarUrl ?? undefined,
        preferredLocale,
        isDemo: profile.isDemo,
      });

      setSuccessMsg(t.savedSuccess);

      // If language changed, redirect to the new locale prefix
      const nextLoc = preferredLocale !== locale ? preferredLocale : locale;
      const targetUrl =
        profile.role === "teacher"
          ? `/${nextLoc}/teacher-dashboard/profile`
          : `/${nextLoc}/me/profile`;
      setTimeout(() => {
        router.push(targetUrl);
        router.refresh();
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
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
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {errorMsg && (
            <div className="rounded-2xl bg-[#D9534F]/10 border border-[#D9534F]/30 p-4 flex items-start gap-3 text-sm text-[#D9534F]">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="rounded-2xl bg-[#087F8C]/10 border border-[#087F8C]/30 p-4 flex items-start gap-3 text-sm text-[#087F8C]">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="rounded-3xl border border-[#142D40]/10 bg-white p-6 space-y-4">
            <h2 className="text-base font-bold text-[#142D40]">{t.avatarSection}</h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <UserAvatar
                user={{
                  name: displayName,
                  avatarUrl: avatarPreview ?? undefined,
                  role: profile.role,
                }}
                size="xl"
                className="ring-4 ring-[#F8F7F4] shadow-xs"
              />

              <div className="space-y-2.5 text-center sm:text-left">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full bg-[#142D40] px-4 py-2 text-xs font-semibold text-white hover:bg-[#087F8C] transition-colors"
                  >
                    <Upload className="size-3.5" />
                    {t.uploadBtn}
                  </button>

                  {(avatarPreview || avatarFile) && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#142D40]/15 px-3.5 py-2 text-xs font-semibold text-[#D9534F] hover:bg-[#D9534F]/10 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      {t.removeBtn}
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#536574]">{t.avatarHint}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="rounded-3xl border border-[#142D40]/10 bg-white p-6 sm:p-7 space-y-5">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label htmlFor="displayName" className="block text-xs font-bold text-[#142D40]">
                {t.displayNameLabel} <span className="text-[#087F8C]">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                required
                minLength={2}
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-3 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* School / Institution */}
            <div className="space-y-1.5">
              <label htmlFor="school" className="block text-xs font-bold text-[#142D40]">
                {t.schoolLabel}
              </label>
              <input
                id="school"
                type="text"
                maxLength={100}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. Naryn Secondary School #2"
                className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-3 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="bio" className="block text-xs font-bold text-[#142D40]">
                  {t.bioLabel}
                </label>
                <span className="text-xs text-[#536574]">{bio.length}/280</span>
              </div>
              <textarea
                id="bio"
                rows={3}
                maxLength={280}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell other students or colleagues a bit about yourself..."
                className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-3 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label htmlFor="preferredLocale" className="block text-xs font-bold text-[#142D40]">
                {t.languageLabel}
              </label>
              <select
                id="preferredLocale"
                value={preferredLocale}
                onChange={(e) => setPreferredLocale(e.target.value as ProfileLocale)}
                className="w-full rounded-2xl border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-3 text-sm text-[#142D40] focus:border-[#087F8C] focus:bg-white focus:outline-none transition-colors"
              >
                <option value="ky">Кыргызча (Kyrgyz)</option>
                <option value="ru">Русский (Russian)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#066670] transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              {t.saveBtn}
            </button>
            <Link
              href={
                profile.role === "teacher"
                  ? `/${locale}/teacher-dashboard/profile`
                  : `/${locale}/me/profile`
              }
              className="inline-flex items-center rounded-full bg-white border border-[#142D40]/15 px-5 py-3 text-sm font-semibold text-[#536574] hover:bg-[#F8F7F4] transition-colors"
            >
              {t.cancelBtn}
            </Link>
          </div>
        </form>
      </FullWidthSection>
    </div>
  );
}