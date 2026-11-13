"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { useAuthStore } from "@/features/auth/auth-store";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ChemLabLogo } from "@/components/brand/ChemLabLogo";

interface LoginClientProps {
  locale: Locale;
}

export function LoginClient({ locale }: LoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const { user, hydrated, signIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (hydrated && user && !forgotMode) {
      if (nextPath && nextPath.startsWith(`/${locale}/`) && !nextPath.includes("\\")) {
        router.replace(nextPath);
      } else if (user.role === "teacher") {
        router.replace(`/${locale}/teacher-dashboard`);
      } else if (user.role === "admin") {
        router.replace(`/${locale}/admin`);
      } else {
        router.replace(`/${locale}/me`);
      }
    }
  }, [hydrated, user, forgotMode, locale, nextPath, router]);

  const labels = {
    title:
      locale === "ky"
        ? "Кайрадан кош келиңиз"
        : locale === "ru"
        ? "С возвращением"
        : "Welcome back",
    subtitle:
      locale === "ky"
        ? "Окуу прогрессиңизди жана класстарыңызды көрүү үчүн кириңиз."
        : locale === "ru"
        ? "Войдите, чтобы продолжить обучение и открыть свои классы."
        : "Sign in to access your progress and classrooms.",
    emailLabel:
      locale === "ky" ? "Электрондук почта" : locale === "ru" ? "Электронная почта" : "Email",
    passwordLabel:
      locale === "ky" ? "Сырсөз" : locale === "ru" ? "Пароль" : "Password",
    forgotPassword:
      locale === "ky" ? "Сырсөздү унуттуңузбу?" : locale === "ru" ? "Забыли пароль?" : "Forgot password?",
    logInBtn:
      locale === "ky" ? "Кирүү" : locale === "ru" ? "Войти" : "Log In",
    noAccount:
      locale === "ky" ? "Аккаунтуңуз жокпу?" : locale === "ru" ? "Еще нет аккаунта?" : "New to ChemLab KG?",
    signUpLink:
      locale === "ky" ? "Катталуу" : locale === "ru" ? "Создать аккаунт" : "Create an account",
    demoLabel:
      locale === "ky"
        ? "Демо аккаунт менен көрүү"
        : locale === "ru"
        ? "Демонстрационный вход"
        : "Try Demo Account",
    studentDemo:
      locale === "ky" ? "Окуучу (Демо)" : locale === "ru" ? "Ученик (Демо)" : "Student Demo",
    teacherDemo:
      locale === "ky" ? "Мугалим (Демо)" : locale === "ru" ? "Учитель (Демо)" : "Teacher Demo",
    resetTitle:
      locale === "ky"
        ? "Сырсөздү калыбына келтирүү"
        : locale === "ru"
        ? "Восстановление пароля"
        : "Reset your password",
    resetSubtitle:
      locale === "ky"
        ? "Почтаңызды жазыңыз, биз сизге сырсөздү жаңыртуу шилтемесин жөнөтөбүз."
        : locale === "ru"
        ? "Введите ваш email, и мы отправим инструкции по сбросу пароля."
        : "Enter your email and we will send password reset instructions.",
    sendResetBtn:
      locale === "ky" ? "Жөнөтүү" : locale === "ru" ? "Отправить" : "Send Reset Link",
    backToLogin:
      locale === "ky" ? "Артка кайтуу" : locale === "ru" ? "Вернуться ко входу" : "Back to Log In",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const result = await signIn({ email, password });
    setSubmitting(false);

    if (!result.ok || !result.user) {
      setError(result.error || "Invalid email or password.");
      return;
    }

    if (nextPath && nextPath.startsWith(`/${locale}/`) && !nextPath.includes("\\")) {
      router.push(nextPath);
      router.refresh();
      return;
    }

    if (result.user.role === "admin") {
      router.push(`/${locale}/admin`);
    } else if (result.user.role === "teacher") {
      router.push(`/${locale}/teacher-dashboard`);
    } else {
      router.push(`/${locale}/me`);
    }
    router.refresh();
  }

  async function handleDemoLogin(role: "student" | "teacher") {
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    const demoEmail =
      role === "teacher" ? "teacher@chemlab.kg" : "student@chemlab.kg";
    const result = await signIn({ email: demoEmail, password: "chemlab123" });
    setSubmitting(false);

    if (result.ok && result.user) {
      if (nextPath && nextPath.startsWith(`/${locale}/`) && !nextPath.includes("\\")) {
        router.push(nextPath);
      } else {
        router.push(
          result.user.role === "teacher"
            ? `/${locale}/teacher-dashboard`
            : `/${locale}/me`
        );
      }
      router.refresh();
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Ignore network errors
    } finally {
      setSubmitting(false);
      setResetSent(true);
    }
  }

  if (hydrated && user && !forgotMode) {
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
      <div className="relative z-10 max-w-md w-full mx-auto my-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/30 p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <ChemLabLogo href={`/${locale}`} size="lg" className="justify-center" />
            <h1 className="mt-4 text-2xl font-bold text-[#142D40] tracking-tight">
              {forgotMode ? labels.resetTitle : labels.title}
            </h1>
            <p className="mt-1 text-sm text-[#536574]">
              {forgotMode ? labels.resetSubtitle : labels.subtitle}
            </p>
          </div>
          {forgotMode ? (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-[#DCE9DF] text-[#142D40] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">Reset link sent</p>
                    <p className="mt-1 text-[#536574]">
                      If an account exists for <span className="font-semibold text-[#142D40]">{email}</span>, you will receive instructions shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-3.5 rounded-xl bg-[#F7DED0] text-xs font-semibold text-[#142D40]">
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-semibold text-[#142D40] mb-2">
                      {labels.emailLabel}
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@school.kg"
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#087F8C] hover:bg-[#142D40] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {labels.sendResetBtn}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setResetSent(false);
                  setError(null);
                }}
                className="w-full py-2 text-sm font-semibold text-[#536574] hover:text-[#142D40] transition-colors cursor-pointer"
              >
                {labels.backToLogin}
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-[#F7DED0] text-xs font-semibold text-[#142D40]">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-[#142D40] mb-2">
                    {labels.emailLabel}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.kg"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="login-password" className="block text-sm font-semibold text-[#142D40]">
                      {labels.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setError(null);
                      }}
                      className="text-xs font-semibold text-[#536574] hover:text-[#142D40] transition-colors cursor-pointer"
                    >
                      {labels.forgotPassword}
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#F8F7F4] text-[#142D40] placeholder-[#536574]/60 focus:outline-none focus:border-[#087F8C] focus:bg-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#087F8C] hover:bg-[#142D40] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {labels.logInBtn}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Explicitly Labeled Demo Environment Quick Sign-In */}
              <div className="mt-7 pt-6 border-t border-[#E8E6E1]">
                <p className="text-xs font-medium text-[#536574] text-center mb-3">
                  {labels.demoLabel}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleDemoLogin("student")}
                    className="py-2.5 px-3 rounded-xl bg-[#F8F7F4] hover:bg-[#DCECF6] text-[#142D40] font-semibold text-xs border border-[#E8E6E1] transition-colors cursor-pointer"
                  >
                    {labels.studentDemo}
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleDemoLogin("teacher")}
                    className="py-2.5 px-3 rounded-xl bg-[#F8F7F4] hover:bg-[#DCE9DF] text-[#142D40] font-semibold text-xs border border-[#E8E6E1] transition-colors cursor-pointer"
                  >
                    {labels.teacherDemo}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-[#536574]">
                {labels.noAccount}{" "}
                <Link
                  href={`/${locale}/signup`}
                  className="font-semibold text-[#142D40] underline underline-offset-4 hover:text-[#087F8C]"
                >
                  {labels.signUpLink}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
