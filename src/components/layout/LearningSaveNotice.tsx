"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

const messages = {
  en: { error: "Your latest learning changes could not be saved to your account. Check your connection and try the action again.", dismiss: "Dismiss" },
  ru: { error: "Последние изменения не удалось сохранить в аккаунте. Проверьте подключение и повторите действие.", dismiss: "Закрыть" },
  ky: { error: "Акыркы өзгөртүүлөр аккаунтуңузга сакталган жок. Интернет байланышын текшерип, аракетти кайталаңыз.", dismiss: "Жабуу" },
};

export function LearningSaveNotice({ locale }: { locale: Locale }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const fail = () => setFailed(true);
    const clear = () => setFailed(false);
    window.addEventListener("chemlab-save-error", fail);
    window.addEventListener("chemlab-save-success", clear);
    window.addEventListener("chemlab-auth-updated", clear);
    return () => {
      window.removeEventListener("chemlab-save-error", fail);
      window.removeEventListener("chemlab-save-success", clear);
      window.removeEventListener("chemlab-auth-updated", clear);
    };
  }, []);
  if (!failed) return null;
  return <div role="alert" className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-xl items-start gap-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 shadow-lg">
    <p className="flex-1">{messages[locale].error}</p>
    <button type="button" className="rounded px-2 py-1 font-bold underline focus-visible:outline-2" onClick={() => setFailed(false)}>{messages[locale].dismiss}</button>
  </div>;
}
