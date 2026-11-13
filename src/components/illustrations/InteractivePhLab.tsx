"use client";

import React, { useState } from "react";
import type { Locale } from "@/i18n/config";

interface PhStage {
  ph: number;
  liquidFill: string;
  pastelBg: string;
  reagent: Record<Locale, string>;
  observation: Record<Locale, string>;
}

const PH_STAGES: PhStage[] = [
  {
    ph: 2,
    liquidFill: "#E89A87",
    pastelBg: "#F7DED0",
    reagent: {
      en: "Acidic Solution (pH 2)",
      ky: "Кислоталуу чөйрө (pH 2)",
      ru: "Кислая среда (pH 2)",
    },
    observation: {
      en: "Red cabbage indicator turns bright coral-red in strong acids like lemon juice or dilute HCl.",
      ky: "Кызыл кочан индикатору лимон ширеси же HCl сыяктуу кислотада ачык кызыл өңгө өтөт.",
      ru: "Индикатор краснокочанной капусты становится ярко-красным в кислой среде.",
    },
  },
  {
    ph: 7,
    liquidFill: "#8B72BE",
    pastelBg: "#EAE3F5",
    reagent: {
      en: "Neutral Water (pH 7)",
      ky: "Нейтралдуу суу (pH 7)",
      ru: "Нейтральная среда (pH 7)",
    },
    observation: {
      en: "In pure water, the natural pigment stays calm violet.",
      ky: "Таза сууда табигый пигмент өзүнүн кызгылт-көк өңүн сактайт.",
      ru: "В чистой воде природный пигмент сохраняет спокойный фиолетовый цвет.",
    },
  },
  {
    ph: 9,
    liquidFill: "#087F8C",
    pastelBg: "#DCECF6",
    reagent: {
      en: "Baking Soda (pH 9)",
      ky: "Аш содасы (pH 9)",
      ru: "Раствор соды (pH 9)",
    },
    observation: {
      en: "Adding a mild base shifts the indicator to deep teal-blue.",
      ky: "Начар негиз кошулганда эритме көгүш-жашыл түскө боёлот.",
      ru: "В слабощелочной среде окраска переходит в насыщенную сине-зелёную.",
    },
  },
  {
    ph: 12,
    liquidFill: "#F2B544",
    pastelBg: "#DCE9DF",
    reagent: {
      en: "Strong Base (pH 12)",
      ky: "Күчтүү щелочь (pH 12)",
      ru: "Сильная щёлочь (pH 12)",
    },
    observation: {
      en: "In strong alkaline solution, the pigment transforms to warm golden-yellow.",
      ky: "Күчтүү щелочтук чөйрөдө индикатор алтын-сары өңгө өтөт.",
      ru: "В сильнощелочной среде пигмент приобретает золотисто-жёлтую окраску.",
    },
  },
];

export function InteractivePhLab({
  locale,
}: {
  locale: Locale;
  caption?: string;
  hint?: string;
}) {
  const [selectedIdx, setSelectedIdx] = useState(2);
  const current = PH_STAGES[selectedIdx];

  return (
    <div className="rounded-3xl bg-white border border-[#142D40]/10 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        {/* Visual Flask */}
        <div
          className="w-full sm:w-52 h-48 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300"
          style={{ backgroundColor: current.pastelBg }}
        >
          <svg
            viewBox="0 0 210 180"
            className="w-40 h-40"
            role="img"
            aria-label={`Flask at pH ${current.ph}`}
          >
            {/* Dropper */}
            <rect x="98" y="8" width="14" height="20" rx="4" fill="#142D40" />
            <path d="M101 28H109L107 42H103L101 28Z" fill="#FFFFFF" stroke="#142D40" strokeWidth="2" />
            <circle
              cx="105"
              cy="54"
              r="4.5"
              fill={current.liquidFill}
              className="transition-all duration-300"
            />
            {/* Flask Body */}
            <path
              d="M89 44H121V68L159 144C163 152 157 162 147 162H63C53 162 47 152 51 144L89 68V44Z"
              fill="#FFFFFF"
              stroke="#142D40"
              strokeWidth="2.8"
            />
            {/* Liquid inside flask */}
            <path
              d="M69 110H141L156 144C159 150 154 158 146 158H64C56 158 51 150 54 144L69 110Z"
              fill={current.liquidFill}
              className="transition-all duration-300"
            />
            {/* Flask Rim */}
            <rect x="84" y="40" width="42" height="6" rx="3" fill="#142D40" />
          </svg>
        </div>

        {/* Clean Explanation & Controls */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div className="space-y-1.5">
            <span className="inline-block text-xs font-semibold text-[#536574]">
              pH {current.ph}
            </span>
            <h3 className="text-xl font-bold text-[#142D40]">
              {current.reagent[locale]}
            </h3>
            <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
              {current.observation[locale]}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2" role="group" aria-label="Select pH value">
            {PH_STAGES.map((stage, idx) => {
              const active = idx === selectedIdx;
              return (
                <button
                  key={stage.ph}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  aria-pressed={active}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 text-center border text-xs font-bold transition-all ${
                    active
                      ? "border-[#142D40] bg-[#142D40] text-white shadow-xs"
                      : "border-[#142D40]/12 bg-[#F8F7F4] text-[#142D40] hover:border-[#087F8C]"
                  }`}
                >
                  pH {stage.ph}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
