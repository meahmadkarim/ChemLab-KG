"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PenLine,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  FlaskConical,
  FileText,
} from "lucide-react";
import type { StudentLabReport } from "../types";
import type { Locale } from "@/i18n/config";
import { EXPERIMENTS } from "@/features/experiments/data";

interface StudentNotebookSummaryProps {
  locale: Locale;
}

export function StudentNotebookSummary({ locale }: StudentNotebookSummaryProps) {
  const [reports, setReports] = useState<StudentLabReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/notebook")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.reports)) {
          setReports(data.reports);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const titleByLocale = {
    en: "My Lab Notebooks",
    ky: "Менин лаб. дептерлерим",
    ru: "Мой лабораторный журнал",
  }[locale];

  const subtitleByLocale = {
    en: "Student experiment protocols, recorded observations, and teacher evaluations",
    ky: "Эксперименттин протоколдору, байкоолор жана мугалимдин баалоолору",
    ru: "Протоколы опытов, зафиксированные наблюдения и отзывы преподавателя",
  }[locale];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#142D40] flex items-center gap-2">
            <PenLine className="size-4.5 text-[#087F8C]" />
            <span>{titleByLocale}</span>
          </h2>
          <p className="text-xs text-[#536574] mt-0.5">{subtitleByLocale}</p>
        </div>
        <Link
          href={`/${locale}/me/learning`}
          className="text-xs font-semibold text-[#087F8C] hover:underline flex items-center gap-1"
        >
          <span>{locale === "ky" ? "Тажрыйбалар" : locale === "ru" ? "Эксперименты" : "Explore Labs"}</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400">
            {locale === "ky"
              ? "Дептерлер жүктөлүүдө..."
              : locale === "ru"
              ? "Загрузка журнала..."
              : "Loading lab notebooks..."}
          </div>
        ) : reports.length === 0 ? (
          <div className="py-4 text-center space-y-2">
            <div className="size-10 rounded-full bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center mx-auto">
              <FlaskConical className="size-5" />
            </div>
            <p className="text-xs font-semibold text-[#142D40]">
              {locale === "ky"
                ? "Азырынча сакталган дептерлер жок"
                : locale === "ru"
                ? "Журнал пока пуст"
                : "No lab reports drafted yet"}
            </p>
            <p className="text-[11px] text-[#536574] max-w-md mx-auto leading-relaxed">
              {locale === "ky"
                ? "Каалаган тажрыйбаны ачып, «Менин лаб. дептерим» бөлүмүнөн жеке максаттарыңызды жана байкоолоруңузду жаза баштаңыз."
                : locale === "ru"
                ? "Откройте любой эксперимент и перейдите во вкладку «Мой лаб. журнал», чтобы вести записи и отправить их на проверку."
                : "Open any experiment and navigate to the 'My Lab Notebook' tab to record your hypothesis, procedure steps, observations, and submit for teacher review."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.slice(0, 5).map((rep) => {
              const exp = EXPERIMENTS.find((e: { slug: string; title: Record<Locale, string> }) => e.slug === rep.experimentSlug);
              const expTitle = exp?.title[locale] || rep.experimentSlug;

              return (
                <div
                  key={rep.id}
                  className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#142D40] truncate">
                        {expTitle}
                      </span>
                      {rep.status === "reviewed" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="size-3" />
                          <span>{locale === "ky" ? "Текшерилди" : locale === "ru" ? "Проверено учителем" : "Reviewed"}</span>
                        </span>
                      ) : rep.status === "submitted" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                          <Clock className="size-3" />
                          <span>{locale === "ky" ? "Жөнөтүлдү" : locale === "ru" ? "Отправлено" : "Submitted"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <FileText className="size-3" />
                          <span>{locale === "ky" ? "Долбоор" : locale === "ru" ? "Черновик" : "In Progress (Draft)"}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#536574] flex items-center gap-2">
                      <span>
                        {rep.mode === "supervised_lab"
                          ? locale === "ky" ? "Лабораториялык иш" : locale === "ru" ? "Практическая работа" : "Supervised Practical Lab"
                          : locale === "ky" ? "Видео байкоо" : locale === "ru" ? "Наблюдение по видео" : "Video Observation"}
                      </span>
                      <span>·</span>
                      <span>
                        {locale === "ky" ? "Жаңыртылды: " : locale === "ru" ? "Обновлено: " : "Updated: "}
                        {new Date(rep.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {rep.teacherFeedback && (
                      <div className="text-[11px] text-emerald-900 bg-emerald-50/80 border border-emerald-200 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5 mt-1">
                        <MessageSquare className="size-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 italic">
                          &quot;{rep.teacherFeedback}&quot;
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/${locale}/me/experiments/${rep.experimentSlug}?tab=notebook`}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F8F7F4] hover:bg-[#E6F2F5] text-[#087F8C] transition-colors border border-slate-200 group-hover:border-[#087F8C]/40"
                  >
                    <span>{locale === "ky" ? "Дептерди ачуу" : locale === "ru" ? "Открыть журнал" : "Open Notebook"}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
