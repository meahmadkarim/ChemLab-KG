"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { useAuthStore, UserRole } from "@/features/auth/auth-store";
import { ArrowRight, Check } from "lucide-react";
import { ChemLabLogo } from "@/components/brand/ChemLabLogo";

interface SignupClientProps {
  locale: Locale;
}

export function SignupClient({ locale }: SignupClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");
  const initialRole: UserRole = initialRoleParam === "teacher" ? "teacher" : "student";

  const { user, hydrated, signUp } = useAuthStore();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (hydrated && user) {
      if (user.role === "teacher") {
        router.replace(`/${locale}/teacher-dashboard`);
      } else if (user.role === "admin") {
        router.replace(`/${locale}/admin`);
      } else {
        router.replace(`/${locale}/me`);
      }
    }
  }, [hydrated, user, locale, router]);

  const labels = {
    title:
      locale === "ky"
        ? "Аккаунт түзүү"
        : locale === "ru"
        ? "Создать аккаунт"
        : "Create your account",
    subtitle:
      locale === "ky"
        ? "Окуу прогрессиңизди сактоо же класстарды башкаруу үчүн катталыңыз."
        : locale === "ru"
        ? "Сохраняйте прогресс обучения или управляйте классами."
        : "Save your progress, join classrooms, or manage assignments.",
    imAStudent:
      locale === "ky" ? "Мен окуучумун" : locale === "ru" ? "Я ученик" : "I'm a Student",
    studentDesc:
      locale === "ky"
        ? "Тест упайларын сактап, класска кошулуңуз."
        : locale === "ru"
        ? "Сохраняйте результаты тестов и вступайте в классы."
        : "Track progress, save experiments, and join classrooms.",
    imATeacher:
      locale === "ky" ? "Мен мугалиммин" : locale === "ru" ? "Я учитель" : "I'm a Teacher",
    teacherDesc:
      locale === "ky"
        ? "Класстарды түзүп, тапшырмаларды башкарыңыз."
        : locale === "ru"
        ? "Создавайте классы и назначайте лабораторные работы."
        : "Create classrooms, assign experiments, and review student work.",
    nameLabel:
      locale === "ky" ? "Толук аты-жөнүңүз" : locale === "ru" ? "Имя и фамилия" : "Full name",
    emailLabel:
      locale === "ky" ? "Электрондук почта" : locale === "ru" ? "Электронная почта" : "Email",
    passwordLabel:
      locale === "ky"
        ? "Сырсөз (8+ белги)"
        : locale === "ru"
        ? "Пароль (не менее 8 символов)"
        : "Password (8+ characters)",
    schoolLabel:
      role === "teacher"
        ? locale === "ky"
          ? "Мектептин аталышы"
          : locale === "ru"
          ? "Школа / учебное заведение"
          : "School name"
        : locale === "ky"
        ? "Мектеп (милдеттүү эмес)"
        : locale === "ru"
        ? "Школа (необязательно)"
        : "School (optional)",
    createBtn:
      locale === "ky"
        ? "Аккаунт түзүү"
        : locale === "ru"
        ? "Зарегистрироваться"
        : "Continue",
    haveAccount:
      locale === "ky" ? "Аккаунтуңуз барбы?" : locale === "ru" ? "Уже есть аккаунт?" : "Already have an account?",
    logInLink:
      locale === "ky" ? "Кирүү" : locale === "ru" ? "Войти" : "Log In",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const result = await signUp({
      name,
      email,
      password,
      role,
      school,
    });
    setSubmitting(false);

    if (result.confirmationRequired) { setConfirmation(true); return; }
    if (!result.ok || !result.user) {
      setError(result.error || "Unable to create account.");
      return;
    }

    if (result.user.role === "teacher") {
      router.push(`/${locale}/teacher-dashboard`);
    } else {
      router.push(`/${locale}/me`);
    }
    router.refresh();
  }

  if (confirmation) {
    return (
      <div className="relative min-h-[calc(100vh-6rem)] w-full py-12 sm:py-16 px-4 sm:px-6 flex flex-col justify-center items-center overflow-x-hidden bg-[#142D40]">
        <Image
          src="/images/hero-chemistry.jpg"
          alt="Chemistry laboratory background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 45, 64, 0.90) 0%, rgba(20, 45, 64, 0.80) 50%, rgba(20, 45, 64, 0.92) 100%)",
          }}
        />
        <div className="relative z-10 max-w-lg w-full mx-auto my-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/30 p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <ChemLabLogo href={`/${locale}`} size="lg" className="justify-center" />
            <div className="size-14 mx-auto rounded-full bg-[#087F8C]/10 text-[#087F8C] flex items-center justify-center">
              <Check className="size-7" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#142D40] tracking-tight">
                {locale === "ky"
                  ? "Электрондук почтаңызды текшериңиз"
                  : locale === "ru"
                  ? "Проверьте вашу почту"
                  : "Check your email"}
              </h1>
              <p className="text-sm text-[#536574] leading-relaxed">
                {locale === "ky"
                  ? `Биз ${email} дарегине ырастоо шилтемесин жөнөттүк. Аккаунтуңузду иштетүү үчүн почтаңыздагы шилтемени басыңыз.`
                  : locale === "ru"
                  ? `Мы отправили ссылку для подтверждения на ${email}. Перейдите по ссылке в письме, чтобы активировать аккаунт и войти.`
                  : `We sent a confirmation link to ${email}. Click the link in the email to activate your account and sign in.`}
              </p>
              {role === "teacher" && (
                <div className="rounded-xl bg-[#087F8C]/10 border border-[#087F8C]/20 p-3.5 text-left text-xs text-[#142D40] space-y-1">
                  <p className="font-semibold text-[#087F8C]">
                    {locale === "ky"
                      ? "Мугалимдик аккаунт:"
                      : locale === "ru"
                      ? "Учительский аккаунт:"
                      : "Teacher Account Notice:"}
                  </p>
                  <p className="text-[#536574]">
                    {locale === "ky"
                      ? "Почтаңызды ырастагандан кийин мугалимдердин жеке кабинетине кире аласыз. Бардык эксперименттер жана материалдар дароо жеткиликтүү."
                      : locale === "ru"
                      ? "После подтверждения почты вам будет открыт доступ в учительский кабинет. Все лабораторные работы и учебные материалы доступны сразу."
                      : "After confirming your email, you will be able to log in directly to your Teacher Dashboard. All chemistry resources and experiments will be accessible."}
                  </p>
                </div>
              )}
            </div>
            <Link
              href={`/${locale}/login`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white py-3.5 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              {labels.logInLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hydrated && user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-[#536574]">
            {locale === "ky"
              ? "Жеке панелге багытталууда..."
              : locale === "ru"
              ? "Перенаправление в личный кабинет..."
              : "Redirecting to your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-6rem)] w-full py-12 sm:py-16 px-4 sm:px-6 flex flex-col justify-center items-center overflow-x-hidden bg-[#142D40]">
      {/* Background Laboratory Photograph */}
      <Image
        src="/images/hero-chemistry.jpg"
        alt="Chemistry laboratory background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none"
      />

      {/* Dark Navy Overlay matching homepage visual philosophy */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(20, 45, 64, 0.90) 0%, rgba(20, 45, 64, 0.80) 50%, rgba(20, 45, 64, 0.92) 100%)",
        }}
      />

      {/* Centered White Authentication Card */}
      <div className="relative z-10 max-w-lg w-full mx-auto my-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/30 p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <ChemLabLogo href={`/${locale}`} size="lg" className="justify-center" />
            <h1 className="mt-4 text-2xl font-bold text-[#142D40] tracking-tight">
              {labels.title}
            </h1>
            <p className="mt-1 text-sm text-[#536574]">{labels.subtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Clean Role Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  role === "student"
                    ? "border-[#087F8C] bg-[#DCECF6]/45"
                    : "border-[#E8E6E1] hover:border-[#142D40]/30 bg-white"
                }`}
              >
                {role === "student" && (
                  <span className="w-5 h-5 rounded-full bg-[#087F8C] text-white flex items-center justify-center absolute top-4 right-4">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="font-bold text-base text-[#142D40]">
                  {labels.imAStudent}
                </div>
                <p className="mt-1 text-xs text-[#536574] leading-relaxed">
                  {labels.studentDesc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  role === "teacher"
                    ? "border-[#087F8C] bg-[#DCE9DF]/50"
                    : "border-[#E8E6E1] hover:border-[#142D40]/30 bg-white"
                }`}
              >
                {role === "teacher" && (
                  <span className="w-5 h-5 rounded-full bg-[#087F8C] text-white flex items-center justify-center absolute top-4 right-4">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="font-bold text-base text-[#142D40]">
                  {labels.imATeacher}
                </div>
                <p className="mt-1 text-xs text-[#536574] leading-relaxed">
                  {labels.teacherDesc}
                </p>
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#F7DED0] text-xs font-semibold text-[#142D40]">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-semibold text-[#142D40] mb-1.5">
                  {labels.nameLabel}
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "teacher" ? "Aigul Asanova" : "Aibek Kadyrov"}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold text-[#142D40] mb-1.5">
                  {labels.emailLabel}
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.kg"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-semibold text-[#142D40] mb-1.5">
                  {labels.passwordLabel}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                />
              </div>

              <div>
                <label htmlFor="signup-school" className="block text-sm font-semibold text-[#142D40] mb-1.5">
                  {labels.schoolLabel}
                </label>
                <input
                  id="signup-school"
                  type="text"
                  required={role === "teacher"}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Naryn Secondary School #2"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 rounded-xl bg-[#087F8C] hover:bg-[#142D40] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {labels.createBtn}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8E6E1] text-center text-sm text-[#536574]">
            {labels.haveAccount}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold text-[#142D40] underline underline-offset-4 hover:text-[#087F8C]"
            >
              {labels.logInLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
