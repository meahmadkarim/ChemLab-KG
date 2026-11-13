"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function InteractiveConceptCheck({
  locale,
  copy,
}: {
  locale: Locale;
  copy: Dictionary["interactivePreview"];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = copy.options.find((o) => o.id === selectedId);

  return (
    <FullWidthSection id="interactive-check" tone="warm" size="spacious">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Editorial Column */}
        <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-5">
          <h2 className="heading-section text-[#142D40]">
            {locale === "ky"
              ? "Билимиңизди текшериңиз"
              : locale === "ru"
              ? "Проверьте интуицию"
              : "Test Your Intuition"}
          </h2>
          <p className="body-lead text-[#536574] max-w-md">
            {locale === "ky"
              ? "Сууну электр тогу менен ажыратканда эмне үчүн бир пробиркада эки эсе көп газ чогулат?"
              : locale === "ru"
              ? "Почему при электролизе воды в одной пробирке собирается вдвое больше газа?"
              : "When electricity splits water, why does one tube collect twice as much gas?"}
          </p>

          <div className="rounded-3xl overflow-hidden bg-white border border-[#142D40]/10 shadow-xs max-w-md">
            <ChemIllustration
              variant="electrolysis-tubes"
              slug="electrolysis-of-water-hoffman"
              className="w-full h-56"
            />
          </div>
        </ScrollReveal>

        {/* Right Interactive Question Card */}
        <ScrollReveal
          variant="scale-in"
          delayMs={120}
          className="lg:col-span-7"
        >
          <div className="rounded-3xl bg-white border border-[#142D40]/10 p-6 sm:p-9 shadow-sm space-y-5">
            <p className="text-lg sm:text-xl font-bold text-[#142D40] leading-snug">
              {copy.questionPrompt}
            </p>

            <div
              className="space-y-3"
              role="radiogroup"
              aria-label={copy.questionLabel}
            >
              {copy.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                const showCorrect = submitted && isSelected && opt.isCorrect;
                const showWrong = submitted && isSelected && !opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(opt.id);
                      setSubmitted(true);
                    }}
                    className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-150 cursor-pointer flex items-start gap-3.5 ${
                      showCorrect
                        ? "border-[#15803D] bg-[#DCE9DF]/65 text-[#142D40]"
                        : showWrong
                        ? "border-[#B91C1C] bg-[#F7DED0]/65 text-[#142D40]"
                        : isSelected
                        ? "border-[#087F8C] bg-[#DCECF6]/40 text-[#142D40]"
                        : "border-[#142D40]/12 bg-white hover:border-[#087F8C] text-[#142D40]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${
                        showCorrect
                          ? "bg-[#15803D] text-white"
                          : showWrong
                          ? "bg-[#B91C1C] text-white"
                          : "bg-[#F8F7F4] text-[#142D40] border border-[#142D40]/15"
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-base font-medium leading-snug flex-1 text-[#142D40]">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback Banner */}
            {submitted && selectedOption && (
              <div
                className={`rounded-2xl p-5 border ${
                  selectedOption.isCorrect
                    ? "bg-[#DCE9DF]/55 border-[#15803D]/30 text-[#142D40]"
                    : "bg-[#F7DED0]/60 border-[#B45309]/30 text-[#142D40]"
                }`}
                role="status"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#142D40]">
                    {selectedOption.isCorrect ? (
                      <>
                        <CheckCircle2 className="size-4 text-[#15803D]" />
                        <span>{copy.correctBadge}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 text-[#B91C1C]" />
                        <span>
                          {locale === "ky"
                            ? "Кайра ойлонуп көрөлү:"
                            : locale === "ru"
                            ? "Посмотрим внимательнее:"
                            : "Let's look closer:"}
                        </span>
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setSubmitted(false);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#087F8C] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    {copy.tryAgainBtn}
                  </button>
                </div>
                <p className="text-sm text-[#536574] leading-relaxed">
                  {selectedOption.feedback}
                </p>
                <div className="mt-3 pt-3 border-t border-[#142D40]/10 flex justify-end">
                  <Link
                    href={`/${locale}/experiments/electrolysis-of-water-hoffman`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087F8C] hover:underline"
                  >
                    {copy.openFullExperiment}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </FullWidthSection>
  );
}
