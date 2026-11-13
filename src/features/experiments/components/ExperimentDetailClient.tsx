"use client";

import { useSyncExternalStore } from "react";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Play,
  ShieldAlert,
  CheckCircle2,
  Bookmark,
  GraduationCap,
  FileDown,
  Bot,
  BookOpen,
  HelpCircle,
  FlaskConical,
  ListOrdered,
  Eye,
  PenLine,
  Clock,
  MessageSquare,
  ClipboardList,
  Target,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { extractYouTubeId, type Experiment, type TopicInfo } from "../types";
import { getExperimentProcedure } from "../procedures-data";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatDuration } from "@/i18n/format";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { ChemLabTutorPanel } from "@/features/ai/components/ChemLabTutorPanel";
import { InteractiveExperimentQuiz } from "@/features/quiz/components/InteractiveExperimentQuiz";
import { StudentLabNotebook } from "@/features/notebook/components/StudentLabNotebook";
import { TeacherLabNotebook } from "@/features/notebook/components/TeacherLabNotebook";
import { useLearningStore } from "@/features/progress/learning-store";
import { useAuthStore } from "@/features/auth/auth-store";
import { useRecommendations } from "@/features/recommendations/use-recommendations";
import { YouTubePlayer } from "@/components/experiments/YouTubePlayer";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type LearningSectionTab = "procedure" | "science" | "safety" | "quiz" | "tutor" | "notebook";

const SECTION_LABELS: Record<
  Locale,
  {
    whatHappenedTitle: string;
    whatHappenedSubtitle: string;
    observationOptions: Array<{
      id: string;
      label: string;
      isCorrect: boolean;
      feedback: string;
    }>;
    procedureTab: string;
    scienceTab: string;
    safetyTab: string;
    quizTab: string;
    tutorTab: string;
    notebookTab: string;
    whatYouDiscover: string;
    scienceBehindIt: string;
    exploreNext: string;
    procedureIntroTitle: string;
    procedureUnderReviewTitle: string;
    procedureUnderReviewDesc: string;
    verifiedBadge: string;
    underReviewBadge: string;
    teacherSupervisionBadge: string;
    observationTitle: string;
    safetyCautionTitle: string;
    materialsStepTitle: string;
  }
> = {
  en: {
    whatHappenedTitle: "What do you think happened?",
    whatHappenedSubtitle:
      "After watching the reaction, pick the statement that best matches what you observed.",
    observationOptions: [
      {
        id: "obs-1",
        label:
          "A visible chemical change (color shift, gas bubbles, crystal growth, or heat) showed new substances forming.",
        isCorrect: true,
        feedback:
          "Spot on! Macroscopic changes like color transitions, gas evolution, or precipitates are direct evidence of molecular rearrangement.",
      },
      {
        id: "obs-2",
        label:
          "Nothing changed at the molecular level—the liquids only mixed without reacting.",
        isCorrect: false,
        feedback:
          "Look closely at the key step in the video: a distinct observable change takes place as the reactants interact.",
      },
    ],
    procedureTab: "Procedure",
    scienceTab: "Science Behind It",
    safetyTab: "Materials & Safety",
    quizTab: "Try the Quiz",
    tutorTab: "Ask ChemLab AI",
    notebookTab: "My Lab Notebook",
    whatYouDiscover: "What You'll Discover",
    scienceBehindIt: "Science Behind It",
    exploreNext: "Explore Next",
    procedureIntroTitle: "Experimental Procedure & Chronological Protocol",
    procedureUnderReviewTitle: "Procedure Under Review",
    procedureUnderReviewDesc:
      "The step-by-step laboratory protocol for this experiment is currently being verified by our curriculum specialists. Please follow your teacher's guidance and consult the Materials & Safety tab.",
    verifiedBadge: "Curriculum-Verified Procedure",
    underReviewBadge: "Procedure Under Review",
    teacherSupervisionBadge: "Teacher-Supervised Demonstration",
    observationTitle: "Key Observation",
    safetyCautionTitle: "Safety Reminder",
    materialsStepTitle: "Materials & apparatus for this step:",
  },
  ky: {
    whatHappenedTitle: "Кандай өзгөрүү болду деп ойлойсуз?",
    whatHappenedSubtitle:
      "Видеону көргөндөн кийин байкалган кубулушту эң так сүрөттөгөн жоопту тандаңыз.",
    observationOptions: [
      {
        id: "obs-1",
        label:
          "Өңдүн өзгөрүшү, газ көбүкчөлөрү, кристаллдар же жылуулук жаңы заттар пайда болгонун көрсөттү.",
        isCorrect: true,
        feedback:
          "Эң туура! Мындай визуалдык белгилер молекулалардын кайра топтошуп, химиялык процесс жүргөнүн далилдейт.",
      },
      {
        id: "obs-2",
        label: "Молекулярдык деңгээлде эч кандай өзгөрүү болгон жок.",
        isCorrect: false,
        feedback:
          "Видеодогу негизги баскычка көңүл буруңуз: реагенттер кошулганда даана байкалган өзгөрүү жүрөт.",
      },
    ],
    procedureTab: "Иштин жүрүшү",
    scienceTab: "Илимий маңызы",
    safetyTab: "Материалдар жана коопсуздук",
    quizTab: "Тестти иштөө",
    tutorTab: "ChemLab AI суроо",
    notebookTab: "Менин лаб. дептерим",
    whatYouDiscover: "Эмнени үйрөнөсүз",
    scienceBehindIt: "Кубулуштун илимий түшүндүрмөсү",
    exploreNext: "Кийинки тажрыйбалар",
    procedureIntroTitle: "Тажрыйбанын ырааттуу жүрүшү",
    procedureUnderReviewTitle: "Иштин жүрүшү текшерилүүдө",
    procedureUnderReviewDesc:
      "Бул тажрыйбанын баскычтуу ыкмасы учурда химия адистери тарабынан текшерилүүдө. Мугалимиңиздин көрсөтмөсүн аткарып, Материалдар жана коопсуздук бөлүмүн караңыз.",
    verifiedBadge: "Программа боюнча текшерилген тартип",
    underReviewBadge: "Текшерүүдө",
    teacherSupervisionBadge: "Мугалимдин көзөмөлүндөгү демонстрация",
    observationTitle: "Негизги байкоо",
    safetyCautionTitle: "Коопсуздук эскертүүсү",
    materialsStepTitle: "Бул кадамдагы материалдар жана идиштер:",
  },
  ru: {
    whatHappenedTitle: "Что, по-вашему, произошло в опыте?",
    whatHappenedSubtitle:
      "После просмотра видео выберите утверждение, которое точнее всего описывает наблюдение.",
    observationOptions: [
      {
        id: "obs-1",
        label:
          "Наглядный признак (смена окраски, выделение газа, кристаллы или тепло) показал перестройку частиц.",
        isCorrect: true,
        feedback:
          "Верно! Макроскопические изменения в пробирке или колбе напрямую отражают протекание процесса на молекулярном уровне.",
      },
      {
        id: "obs-2",
        label: "Никаких изменений с веществами не произошло.",
        isCorrect: false,
        feedback:
          "Обратите внимание на ключевой момент видео: при взаимодействии компонентов наблюдается отчётливый эффект.",
      },
    ],
    procedureTab: "Ход работы",
    scienceTab: "Научное объяснение",
    safetyTab: "Материалы и безопасность",
    quizTab: "Пройти тест",
    tutorTab: "Спросить ChemLab AI",
    notebookTab: "Мой лаб. журнал",
    whatYouDiscover: "Что вы узнаете",
    scienceBehindIt: "Научное объяснение",
    exploreNext: "Смотрите далее",
    procedureIntroTitle: "Пошаговый регламент и порядок проведения опыта",
    procedureUnderReviewTitle: "Методика на стадии верификации",
    procedureUnderReviewDesc:
      "Пошаговый регламент данного опыта проходит методическую проверку нашими специалистами. Руководствуйтесь указаниями преподавателя и разделом безопасности.",
    verifiedBadge: "Методически выверенная инструкция",
    underReviewBadge: "На проверке",
    teacherSupervisionBadge: "Демонстрация под контролем преподавателя",
    observationTitle: "Ключевое наблюдение",
    safetyCautionTitle: "Правило безопасности",
    materialsStepTitle: "Оборудование и реактивы на данном шаге:",
  },
};

interface ReflectionPrompt {
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

function getExperimentReflection(
  experiment: Experiment,
  locale: Locale
): ReflectionPrompt {
  const slug = experiment.slug;
  if (slug.includes("sodium") || slug.includes("alkali")) {
    return {
      question:
        locale === "ru"
          ? "Какое наблюдение свидетельствует о протекании химической реакции?"
          : locale === "ky"
          ? "Кайсы байкоо химиялык реакция жүргөнүн көрсөтөт?"
          : "What evidence shows a chemical change occurred?",
      options: [
        {
          id: "new-substance",
          label:
            locale === "ru"
              ? "Образовалось новое вещество"
              : locale === "ky"
              ? "Жаңы зат пайда болду"
              : "New substance formed",
          isCorrect: true,
          feedback:
            locale === "ru"
              ? "Верно! Выделение газа (H₂), горение и образование щелочи NaOH — ключевые признаки химического превращения."
              : locale === "ky"
              ? "Туура! H₂ газынын бөлүнүп чыгышы жана NaOH щелочунун пайда болушу — химиялык өзгөрүүнүн белгиси."
              : "Correct! Gas evolution (H₂), flame, and formation of alkaline NaOH confirm a chemical change.",
        },
        {
          id: "no-change",
          label:
            locale === "ru"
              ? "Химического изменения нет"
              : locale === "ky"
              ? "Химиялык өзгөрүү болгон жок"
              : "No chemical change",
          isCorrect: false,
          feedback:
            locale === "ru"
              ? "Не совсем так: натрий вступает в бурную окислительно-восстановительную реакцию с водой с выделением тепла и газов."
              : locale === "ky"
              ? "Туура эмес: натрий суу менен катуу аракеттенишип, жаңы химиялык заттарды пайда кылат."
              : "Not quite: sodium undergoes a vigorous redox reaction with water, producing new chemical substances.",
        },
      ],
    };
  }

  if (slug.includes("titration") || slug.includes("acid-base")) {
    return {
      question:
        locale === "ru"
          ? "Что сигнализирует о достижении точки эквивалентности?"
          : locale === "ky"
          ? "Эквиваленттүүлүк чекитине жеткендигин эмне билдирет?"
          : "What signals that the equivalence point has been reached?",
      options: [
        {
          id: "color-change",
          label:
            locale === "ru"
              ? "Устойчивое изменение окраски индикатора"
              : locale === "ky"
              ? "Индикатордун түсүнүн туруктуу өзгөрүшү"
              : "Persistent indicator color change",
          isCorrect: true,
          feedback:
            locale === "ru"
              ? "Верно! Переход фенолфталеина в бледно-розовый цвет отмечает нейтрализацию кислоты."
              : locale === "ky"
              ? "Туура! Фенолфталеиндин ачык кызгылт түскө өтүшү нейтралдашуу аяктаганын көрсөтөт."
              : "Correct! The faint pink transition marks the exact neutralization of acid by base.",
        },
        {
          id: "volume-doubles",
          label:
            locale === "ru"
              ? "Удвоение объема раствора"
              : locale === "ky"
              ? "Эритменин көлөмүнүн эки эсеге көбөйүшү"
              : "Solution volume doubles",
          isCorrect: false,
          feedback:
            locale === "ru"
              ? "Объем в точке эквивалентности определяется молярными соотношениями, а не фиксированным удвоением."
              : locale === "ky"
              ? "Эквиваленттүүлүк көлөмү реагенттердин молярдуулугуна жараша аныкталат."
              : "The equivalence point depends strictly on stoichiometry, not volume doubling.",
        },
      ],
    };
  }

  if (slug.includes("peroxide") || slug.includes("catalytic")) {
    return {
      question:
        locale === "ru"
          ? "Как проявляется действие катализатора в этой реакции?"
          : locale === "ky"
          ? "Бул реакцияда катализатордун аракети кандайча байкалат?"
          : "How is catalytic activity demonstrated in this reaction?",
      options: [
        {
          id: "rapid-gas",
          label:
            locale === "ru"
              ? "Бурное выделение кислорода с пеной"
              : locale === "ky"
              ? "Көбүк менен кычкылтектин тез бөлүнүп чыгышы"
              : "Rapid oxygen gas evolution with foam",
          isCorrect: true,
          feedback:
            locale === "ru"
              ? "Верно! Катализатор резко снижает энергию активации, многократно ускоряя разложение H₂O₂."
              : locale === "ky"
              ? "Туура! Катализатор активдештирүү энергиясын төмөндөтүп, ажыроону кыйла тездетет."
              : "Correct! The catalyst significantly lowers activation energy, speeding up decomposition.",
        },
        {
          id: "catalyst-consumed",
          label:
            locale === "ru"
              ? "Катализатор полностью расходуется"
              : locale === "ky"
              ? "Катализатор толугу менен сарпталат"
              : "Catalyst is permanently consumed",
          isCorrect: false,
          feedback:
            locale === "ru"
              ? "Катализатор участвует в промежуточных стадиях, но регенерируется и не расходуется."
              : locale === "ky"
              ? "Катализатор аралык стадияларга катышат, бирок реакциянын акырында калыбына келет."
              : "Catalysts regenerate in subsequent steps and are not permanently consumed.",
        },
      ],
    };
  }

  return {
    question:
      locale === "ru"
        ? "Какое наблюдение указывает на протекание реакции?"
        : locale === "ky"
        ? "Кайсы байкоо реакция жүрүп жатканын көрсөтөт?"
        : "What evidence shows a chemical change occurred?",
    options: [
      {
        id: "new-substance",
        label:
          locale === "ru"
            ? "Образовалось новое вещество"
            : locale === "ky"
            ? "Жаңы зат пайда болду"
            : "New substance formed",
        isCorrect: true,
        feedback:
          locale === "ru"
            ? "Верно! Изменение состава и свойств указывает на химическое превращение."
            : locale === "ky"
            ? "Туура! Заттын курамынын жана касиеттеринин өзгөрүшү химиялык реакцияны далилдейт."
            : "Correct! Structural composition changes confirm chemical bonds have transformed.",
      },
      {
        id: "no-change",
        label:
          locale === "ru"
            ? "Химического изменения нет"
            : locale === "ky"
            ? "Химиялык өзгөрүү болгон жок"
            : "No chemical change",
        isCorrect: false,
        feedback:
          locale === "ru"
            ? "При протекании реакции обязательно фиксируются качественные превращения исходных веществ."
            : locale === "ky"
            ? "Реакция жүргөндө заттардын баштапкы касиеттери сөзсүз өзгөрөт."
            : "Chemical reactions produce measurable structural and qualitative changes.",
      },
    ],
  };
}

function getExperimentFocus(slug: string, locale: Locale): string {
  if (slug.includes("sodium") || slug.includes("alkali")) {
    return locale === "ru" ? "Химическая реакция" : locale === "ky" ? "Химиялык өзгөрүү" : "Chemical change";
  }
  if (slug.includes("titration") || slug.includes("acid-base")) {
    return locale === "ru" ? "Нейтрализация" : locale === "ky" ? "Нейтралдашуу" : "Neutralization";
  }
  if (slug.includes("peroxide") || slug.includes("catalytic")) {
    return locale === "ru" ? "Кинетика и катализ" : locale === "ky" ? "Кинетика жана катализ" : "Kinetics & catalysis";
  }
  if (slug.includes("electrolysis")) {
    return locale === "ru" ? "Электролиз" : locale === "ky" ? "Электролиз" : "Redox & electrolysis";
  }
  if (slug.includes("cabbage") || slug.includes("indicator")) {
    return locale === "ru" ? "pH-индикаторы" : locale === "ky" ? "pH-индикаторлор" : "pH indicators";
  }
  return locale === "ru" ? "Химические свойства" : locale === "ky" ? "Химиялык касиеттер" : "Chemical change";
}

export function ExperimentDetailClient({
  experiment,
  topic,
  locale,
  copy,
  libraryCopy,
  featuredCopy,
  safetyLabels,
}: {
  experiment: Experiment;
  topic: TopicInfo;
  locale: Locale;
  copy: Dictionary["experimentDetail"];
  libraryCopy: Dictionary["library"];
  featuredCopy: Dictionary["featured"];
  safetyLabels: Dictionary["library"]["safetyLevels"];
}) {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const { state, recordExperimentView, toggleBookmark, createAssignment } =
    useLearningStore();

  const search = useSyncExternalStore(subscribeToLocation, () => window.location.search, () => "");
  const requestedTab = new URLSearchParams(search).get("tab");
  const [chosenTab, setActiveTab] = useState<LearningSectionTab | null>(null);
  const activeTab = chosenTab ?? (requestedTab && ["procedure", "science", "safety", "quiz", "tutor", "notebook"].includes(requestedTab) ? requestedTab as LearningSectionTab : "procedure");
  const [startSeconds, setStartSeconds] = useState(0);
  const [playbackSeconds, setPlaybackSeconds] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [pinnedTimestamp, setPinnedTimestamp] = useState<number | null>(null);
  const [selectedObsId, setSelectedObsId] = useState<string | null>(null);

  // Teacher Quick-Assign Drawer state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState(
    state.classrooms[0]?.id ?? "cls-naryn-01"
  );
  const [assignDueDate, setAssignDueDate] = useState("2026-11-28");

  const labels = SECTION_LABELS[locale];
  const procedure =
    experiment.procedure ??
    getExperimentProcedure(experiment.slug) ??
    getExperimentProcedure(experiment.id);
  const bookmarked = state.bookmarkedSlugs.includes(experiment.slug);
  const videoId = extractYouTubeId(experiment.youtubeVideo);
  useEffect(() => {
    recordExperimentView(experiment.slug);
  }, [experiment.slug, recordExperimentView]);

  function jumpToTime(sec: number) {
    setStartSeconds(sec);
    setPinnedTimestamp(sec);
    setAutoPlay(true);
  }

  function handleAskAboutMoment(sec: number) {
    setPinnedTimestamp(sec);
    setActiveTab("tutor");
  }

  async function handleConfirmAssign() {
    try {
    await createAssignment(selectedClassroomId, {
      experimentSlug: experiment.slug,
      dueDate: assignDueDate,
      permissions: {
        allowHints: true,
        allowAiExplanations: true,
        showImmediateFeedback: true,
        showCorrectAnswers: true,
        allowRetries: true,
      },
    });
    setAssignedSuccess(true);
    } catch (error) { window.alert(error instanceof Error ? error.message : "Assignment could not be saved."); }
  }

  const matchingAssignment = state.classrooms
    .flatMap((c) => c.assignments)
    .find((a) => a.id === new URLSearchParams(search).get("assignment") && a.experimentSlug === experiment.slug);

  const activePermissions = matchingAssignment?.permissions ?? {
    allowHints: true,
    allowAiExplanations: true,
    showImmediateFeedback: true,
    showCorrectAnswers: true,
    allowRetries: true,
  };

  const relatedRecommendations = useRecommendations(experiment.slug);

  const isStudentDashboard = pathname?.includes("/me");
  const isTeacherDashboard = pathname?.includes("/teacher-dashboard");

  const backHref = isStudentDashboard
    ? `/${locale}/me/learning`
    : isTeacherDashboard
    ? `/${locale}/teacher-dashboard/resources`
    : `/${locale}/experiments`;

  const backLabel = isStudentDashboard
    ? locale === "ru"
      ? "Моё обучение"
      : locale === "ky"
      ? "Менин окуум"
      : "My Learning"
    : isTeacherDashboard
    ? locale === "ru"
      ? "Материалы"
      : locale === "ky"
      ? "Ресурстар"
      : "Resources"
    : locale === "ru"
    ? "Библиотека"
    : locale === "ky"
    ? "Китепкана"
    : "Library";

  const crumbSection =
    isStudentDashboard || isTeacherDashboard
      ? locale === "ru"
        ? "Эксперименты"
        : locale === "ky"
        ? "Тажрыйбалар"
        : "Experiments"
      : topic?.title
      ? topic.title[locale]
      : "Experiments";

  const displayTitle =
    experiment.slug === "alkali-metals-sodium-in-water"
      ? locale === "ru"
        ? "Щелочные металлы: Натрий в воде"
        : locale === "ky"
        ? "Шелочтук металлдар: Натрий сууда"
        : "Alkali Metals: Sodium in Water"
      : experiment.title[locale];

  const displaySubtitle =
    experiment.slug === "alkali-metals-sodium-in-water"
      ? locale === "ru"
        ? "Наблюдайте за реакцией натрия с водой и определите ключевые признаки химического превращения."
        : locale === "ky"
        ? "Натрийдин суу менен реакциясын байкап, химиялык өзгөрүүнүн негизги белгилерин аныктаңыз."
        : "Observe the reaction of sodium with water and identify key evidence of chemical change."
      : experiment.shortDescription[locale];

  const topicDisplay =
    experiment.slug.includes("sodium") || experiment.slug.includes("alkali")
      ? locale === "ru"
        ? "Щелочные металлы"
        : locale === "ky"
        ? "Шелочтук металлдар"
        : "Alkali Metals"
      : topic?.title
      ? topic.title[locale]
      : "General Chemistry";

  const focusDisplay = getExperimentFocus(experiment.slug, locale);
  const durationDisplay = `~ ${Math.max(1, Math.round(experiment.durationSeconds / 60))} min`;

  const reflection = getExperimentReflection(experiment, locale);
  const selectedObs = reflection.options.find((o) => o.id === selectedObsId);

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#536574]">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 hover:text-[#142D40] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>{backLabel}</span>
        </Link>
        <ChevronRight className="size-3 text-slate-300" />
        <span className="text-[#536574]">{crumbSection}</span>
      </div>

      {/* 2. EXPERIMENT TITLE BAR WITH TEAL BEAKER ICON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-11 sm:size-12 rounded-2xl bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0 shadow-2xs">
            <FlaskConical className="size-5 sm:size-6 text-[#087F8C]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D40] tracking-tight leading-tight">
              {displayTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#536574] mt-0.5 max-w-3xl leading-relaxed">
              {displaySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {user && (
            <button
              type="button"
              onClick={() => toggleBookmark(experiment.slug)}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border transition-all shadow-2xs ${
                bookmarked
                  ? "bg-[#F7DED0] border-[#B45309]/30 text-[#142D40]"
                  : "bg-white border-slate-200 text-[#142D40] hover:border-[#087F8C]"
              }`}
            >
              <Bookmark
                className={`size-3.5 ${
                  bookmarked ? "fill-current text-[#B45309]" : "text-[#142D40]"
                }`}
              />
              <span>
                {bookmarked
                  ? locale === "ru"
                    ? "Сохранено"
                    : locale === "ky"
                    ? "Сакталды"
                    : "Saved"
                  : locale === "ru"
                  ? "Сохранить опыт"
                  : locale === "ky"
                  ? "Сактоо"
                  : "Save Experiment"}
              </span>
            </button>
          )}

          {user?.role === "teacher" && (
            <button
              type="button"
              onClick={() => {
                setAssignModalOpen((v) => !v);
                setAssignedSuccess(false);
              }}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold bg-[#DCECF6] text-[#142D40] hover:bg-[#142D40] hover:text-white transition-all shadow-2xs"
            >
              <GraduationCap className="size-3.5 text-[#087F8C]" />
              <span>{copy.assignBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. EXPERIMENT VIDEO PLAYER */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#142D40] shadow-md border border-slate-200/60">
        <YouTubePlayer videoId={videoId} startSeconds={startSeconds} autoplay={autoPlay} title={experiment.title[locale]} onTime={setPlaybackSeconds} />
      </div>

      {/* 4. COMPACT VIDEO CHAPTER SHORTCUTS */}
      <div className="flex flex-wrap items-center gap-2.5">
        {experiment.steps.map((step, idx) => {
          const active = startSeconds === step.timeSeconds;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => jumpToTime(step.timeSeconds)}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all shadow-2xs ${
                active
                  ? "bg-[#142D40] text-white"
                  : "bg-white text-[#142D40] border border-slate-200 hover:border-[#087F8C]"
              }`}
            >
              <Play className="size-3 fill-current text-[#087F8C]" />
              <span className="font-semibold">
                {formatDuration(step.timeSeconds)}
              </span>
              <span className="text-[#536574]">· {step.title[locale]}</span>
            </button>
          );
        })}
      </div>

      {/* Teacher Quick-Assign Drawer */}
      {assignModalOpen && user?.role === "teacher" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#142D40] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#087F8C]" />
              {copy.assignBtn}: {displayTitle}
            </h3>
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="text-sm font-bold text-[#536574] hover:text-[#142D40] cursor-pointer"
            >
              ✕
            </button>
          </div>
          {assignedSuccess ? (
            <div className="rounded-xl bg-[#DCE9DF]/65 border border-[#15803D]/30 p-4 text-sm text-[#142D40] flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
              <span>Assigned to classroom!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-[#142D40] mb-1.5">
                  Classroom
                </label>
                <select
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8F7F4] px-3.5 py-2.5 text-sm font-medium text-[#142D40]"
                >
                  {state.classrooms.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.joinCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#142D40] mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8F7F4] px-3.5 py-2.5 text-sm font-medium text-[#142D40]"
                />
              </div>
              <button
                type="button"
                onClick={handleConfirmAssign}
                className="px-6 py-2.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Assign
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. SHARED WHITE INFORMATION SECTION (THINK ABOUT IT + EXPERIMENT OVERVIEW) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT: Think About It */}
          <div className="space-y-3 lg:pr-6 lg:border-r border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#142D40]">
                <MessageSquare className="size-5 text-[#087F8C]" />
                <h3 className="text-base font-bold text-[#142D40]">
                  {locale === "ru"
                    ? "Подумайте над этим"
                    : locale === "ky"
                    ? "Бул тууралуу ойлонуп көрүңүз"
                    : "Think About It"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#536574] mt-1 font-medium">
                {reflection.question}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center gap-5 sm:gap-7">
                {reflection.options.map((opt) => {
                  const isSelected = selectedObsId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedObsId(opt.id)}
                      className="cursor-pointer inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#142D40] hover:text-[#087F8C] transition-colors group"
                    >
                      <span
                        className={`size-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#087F8C] bg-white ring-2 ring-[#087F8C]/20"
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}
                      >
                        {isSelected && (
                          <span className="size-2 rounded-full bg-[#087F8C]" />
                        )}
                      </span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedObs && (
                <div
                  className={`rounded-xl p-3 text-xs sm:text-sm border transition-all mt-2 flex items-start gap-2.5 ${
                    selectedObs.isCorrect
                      ? "bg-[#DCE9DF]/70 border-[#15803D]/30 text-[#142D40]"
                      : "bg-[#F7DED0]/70 border-[#B45309]/30 text-[#142D40]"
                  }`}
                >
                  <span className="shrink-0 font-bold">
                    {selectedObs.isCorrect ? "✓" : "ℹ"}
                  </span>
                  <p className="leading-relaxed">{selectedObs.feedback}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Experiment Overview */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#142D40]">
                <ClipboardList className="size-5 text-[#087F8C]" />
                <h3 className="text-base font-bold text-[#142D40]">
                  {locale === "ru"
                    ? "Обзор эксперимента"
                    : locale === "ky"
                    ? "Тажрыйбага сереп"
                    : "Experiment Overview"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {/* Topic */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#536574]">
                  <FlaskConical className="size-4 text-[#087F8C]" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#536574]">
                    {locale === "ru" ? "Тема" : locale === "ky" ? "Тема" : "Topic"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#142D40] leading-snug">
                  {topicDisplay}
                </p>
              </div>

              {/* Focus */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#536574]">
                  <Target className="size-4 text-[#087F8C]" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#536574]">
                    {locale === "ru" ? "Фокус" : locale === "ky" ? "Багыт" : "Focus"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#142D40] leading-snug">
                  {focusDisplay}
                </p>
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#536574]">
                  <Clock className="size-4 text-[#087F8C]" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#536574]">
                    {locale === "ru"
                      ? "Время"
                      : locale === "ky"
                      ? "Убактысы"
                      : "Duration"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#142D40] leading-snug">
                  {durationDisplay}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CONNECTED HORIZONTAL TABS STRIP */}
      <div className="border-b border-slate-200 bg-white">
        <div
          role="tablist"
          aria-label="Experiment learning sections"
          className="flex items-stretch overflow-x-auto scrollbar-none divide-x divide-slate-100"
        >
          {/* Tab 1: My Lab Notebook */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "notebook"}
            onClick={() => setActiveTab("notebook")}
            className={`relative flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm transition-colors cursor-pointer shrink-0 ${
              activeTab === "notebook"
                ? "text-[#142D40] font-bold bg-white"
                : "text-[#536574] hover:text-[#142D40] hover:bg-slate-50/70 font-semibold"
            }`}
          >
            <PenLine
              className={`size-4 ${
                activeTab === "notebook" ? "text-[#087F8C]" : "text-[#536574]"
              }`}
            />
            <span>
              {user?.role === "teacher" || user?.role === "admin"
                ? locale === "ru"
                  ? "Лабораторный журнал учителя"
                  : locale === "ky"
                  ? "Мугалимдин лаб. журналы"
                  : "Teacher Lab Notebook"
                : labels.notebookTab}
            </span>
            {activeTab === "notebook" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#087F8C]" />
            )}
          </button>

          {/* Tab 2: Procedure */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "procedure"}
            onClick={() => setActiveTab("procedure")}
            className={`relative flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm transition-colors cursor-pointer shrink-0 ${
              activeTab === "procedure"
                ? "text-[#142D40] font-bold bg-white"
                : "text-[#536574] hover:text-[#142D40] hover:bg-slate-50/70 font-semibold"
            }`}
          >
            <ListOrdered
              className={`size-4 ${
                activeTab === "procedure" ? "text-[#087F8C]" : "text-[#536574]"
              }`}
            />
            <span>{labels.procedureTab}</span>
            {activeTab === "procedure" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#087F8C]" />
            )}
          </button>

          {/* Tab 3: Science Behind It */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "science"}
            onClick={() => setActiveTab("science")}
            className={`relative flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm transition-colors cursor-pointer shrink-0 ${
              activeTab === "science"
                ? "text-[#142D40] font-bold bg-white"
                : "text-[#536574] hover:text-[#142D40] hover:bg-slate-50/70 font-semibold"
            }`}
          >
            <BookOpen
              className={`size-4 ${
                activeTab === "science" ? "text-[#087F8C]" : "text-[#536574]"
              }`}
            />
            <span>{labels.scienceTab}</span>
            {activeTab === "science" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#087F8C]" />
            )}
          </button>

          {/* Tab 4: Materials & Safety */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "safety"}
            onClick={() => setActiveTab("safety")}
            className={`relative flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm transition-colors cursor-pointer shrink-0 ${
              activeTab === "safety"
                ? "text-[#142D40] font-bold bg-white"
                : "text-[#536574] hover:text-[#142D40] hover:bg-slate-50/70 font-semibold"
            }`}
          >
            <ShieldAlert
              className={`size-4 ${
                activeTab === "safety" ? "text-[#087F8C]" : "text-[#536574]"
              }`}
            />
            <span>{labels.safetyTab}</span>
            {activeTab === "safety" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#087F8C]" />
            )}
          </button>

          {/* Tab 5: Try the Quiz */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "quiz"}
            onClick={() => setActiveTab("quiz")}
            className={`relative flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm transition-colors cursor-pointer shrink-0 ${
              activeTab === "quiz"
                ? "text-[#142D40] font-bold bg-white"
                : "text-[#536574] hover:text-[#142D40] hover:bg-slate-50/70 font-semibold"
            }`}
          >
            <HelpCircle
              className={`size-4 ${
                activeTab === "quiz" ? "text-[#087F8C]" : "text-[#536574]"
              }`}
            />
            <span>
              {labels.quizTab} ({experiment.quiz.length})
            </span>
            {activeTab === "quiz" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#087F8C]" />
            )}
          </button>

          {/* Tab 6: Ask ChemLab AI */}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "tutor"}
            disabled={playbackSeconds === null}
            onClick={() => { if (playbackSeconds !== null) handleAskAboutMoment(playbackSeconds); }}
            className={`relative flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm transition-colors cursor-pointer shrink-0 ${
              activeTab === "tutor"
                ? "text-[#142D40] font-bold bg-white"
                : "text-[#536574] hover:text-[#142D40] hover:bg-slate-50/70 font-semibold"
            }`}
          >
            <Bot
              className={`size-4 ${
                activeTab === "tutor" ? "text-[#087F8C]" : "text-[#536574]"
              }`}
            />
            <span>{labels.tutorTab}</span>
            {activeTab === "tutor" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#087F8C]" />
            )}
          </button>
        </div>
      </div>

      {/* 7. ACTIVE TAB CONTENT */}
      <div className="pt-2">

          {/* TAB 1: Step-by-Step Procedure */}
          {activeTab === "procedure" && (
            <div className="space-y-6">
              {procedure && procedure.reviewStatus === "verified" ? (
                <>
                  {/* Status badges & Header Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#142D40]/10 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E6F2F5] text-[#087F8C] border border-[#087F8C]/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#087F8C]" />
                        {labels.verifiedBadge}
                      </span>
                      {procedure.teacherSupervised && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#F7DED0] text-[#B45309] border border-[#B45309]/20">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
                          {labels.teacherSupervisionBadge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#142D40] flex items-center gap-2.5">
                        <ListOrdered className="w-6 h-6 text-[#087F8C] shrink-0" />
                        {labels.procedureIntroTitle}
                      </h2>
                      <p className="text-base text-[#536574] leading-relaxed">
                        {procedure.introduction[locale]}
                      </p>
                    </div>

                    {procedure.supervisionNotice && (
                      <div className="rounded-2xl bg-[#F7DED0]/60 border-l-4 border-[#B45309] p-4 text-xs sm:text-sm text-[#142D40] flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">
                          {procedure.supervisionNotice[locale]}
                        </span>
                      </div>
                    )}

                    {procedure.safetyOverview && (
                      <div className="rounded-2xl bg-[#E6F2F5] border-l-4 border-[#087F8C] p-4 text-xs sm:text-sm text-[#142D40] flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">
                          {procedure.safetyOverview[locale]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Step by Step Sequence */}
                  <div className="space-y-4">
                    {procedure.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="bg-white rounded-3xl p-6 sm:p-7 border border-[#142D40]/10 shadow-sm transition-all hover:border-[#087F8C]/40"
                      >
                        <div className="flex items-start gap-4 sm:gap-5">
                          {/* Step number badge */}
                          <div className="w-10 h-10 rounded-2xl bg-[#142D40] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                            {step.stepNumber}
                          </div>

                          <div className="flex-1 space-y-3.5">
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-[#142D40] leading-snug">
                                {step.title[locale]}
                              </h3>
                            </div>

                            <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
                              {step.description[locale]}
                            </p>

                            {/* Materials used in this step */}
                            {step.materialsUsed &&
                              step.materialsUsed[locale] &&
                              step.materialsUsed[locale].length > 0 && (
                                <div className="pt-1">
                                  <div className="text-xs font-semibold text-[#536574] mb-2">
                                    {labels.materialsStepTitle}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {step.materialsUsed[locale].map(
                                      (mat, mIdx) => (
                                        <span
                                          key={mIdx}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F8F7F4] text-[#142D40] border border-[#142D40]/10"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#087F8C]" />
                                          {mat}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Key Observation */}
                            {step.observation && step.observation[locale] && (
                              <div className="rounded-2xl bg-[#E6F2F5] border-l-4 border-[#087F8C] p-4 text-xs sm:text-sm text-[#142D40] space-y-1">
                                <div className="font-bold text-[#087F8C] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                  <Eye className="w-4 h-4" />
                                  {labels.observationTitle}
                                </div>
                                <p className="font-medium leading-relaxed">
                                  {step.observation[locale]}
                                </p>
                              </div>
                            )}

                            {/* Safety note for this step */}
                            {step.safetyNote && step.safetyNote[locale] && (
                              <div className="rounded-2xl bg-[#F7DED0]/70 border-l-4 border-[#B45309] p-4 text-xs sm:text-sm text-[#142D40] space-y-1">
                                <div className="font-bold text-[#B45309] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                  <ShieldAlert className="w-4 h-4" />
                                  {labels.safetyCautionTitle}
                                </div>
                                <p className="font-medium leading-relaxed">
                                  {step.safetyNote[locale]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Fallback when procedure is under review */
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#142D40]/10 text-center max-w-xl mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center mx-auto">
                    <FlaskConical className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#142D40]">
                    {labels.procedureUnderReviewTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
                    {labels.procedureUnderReviewDesc}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: What You'll Discover & Science Behind It */}
          {activeTab === "science" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <h2 className="heading-sub text-[#142D40]">
                  {labels.scienceBehindIt}
                </h2>
                {experiment.scientificExplanation[locale].map((para, i) => (
                  <p
                    key={i}
                    className="text-base text-[#536574] leading-relaxed"
                  >
                    {para}
                  </p>
                ))}

                {/* Readable Chemical Equation Inside Science Behind It */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-[#536574] mb-1.5">
                    {copy.equationTitle}
                  </div>
                  <div className="rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 p-4 font-mono text-sm sm:text-base font-semibold text-[#142D40] overflow-x-auto">
                    {experiment.chemicalEquation}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="bg-[#F8F7F4] rounded-3xl p-6 border border-[#142D40]/10 space-y-4">
                  <div className="rounded-2xl overflow-hidden h-44 bg-white">
                    <ChemIllustration
                      variant={experiment.illustration}
                      slug={experiment.slug}
                      className="w-full h-full"
                    />
                  </div>
                  <h3 className="text-base font-bold text-[#142D40]">
                    {labels.whatYouDiscover}
                  </h3>
                  <ul className="space-y-2.5">
                    {experiment.objectives[locale].map((obj, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[#536574]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Materials & Safety */}
          {activeTab === "safety" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-3xl bg-[#F7DED0]/65 border border-[#142D40]/10 p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-[#142D40] flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#142D40] shrink-0" />
                    {copy.safetyTitle}
                  </h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#142D40] border border-[#142D40]/10">
                    {safetyLabels[experiment.safetyLevel]}
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm sm:text-base text-[#142D40] leading-relaxed pt-1">
                  {experiment.safetyNotes[locale].map((note, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-white text-[#142D40] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8F7F4] rounded-3xl p-6 sm:p-7 border border-[#142D40]/10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-[#142D40] flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-[#087F8C]" />
                    {copy.materialsTitle}
                  </h2>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087F8C] hover:underline cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    {copy.downloadPdf}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {experiment.materials[locale].map((mat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-2xl bg-white border border-[#142D40]/10 p-3 text-sm font-medium text-[#142D40]"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#087F8C] shrink-0" />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Interactive Quiz */}
          {activeTab === "quiz" && (
            <div id="quiz-section">
              <InteractiveExperimentQuiz
                experiment={experiment}
                locale={locale}
                quizCopy={copy.quiz}
                libraryCopy={libraryCopy}
                featuredCopy={featuredCopy}
                permissions={activePermissions}
                assignmentId={user?.isDemo ? undefined : matchingAssignment?.id}
              />
            </div>
          )}

          {/* TAB 4: AI Tutor */}
          {activeTab === "tutor" && (
            <div className="max-w-3xl mx-auto">
              <ChemLabTutorPanel
                experiment={experiment}
                locale={locale}
                pinnedTimestamp={pinnedTimestamp}
                onClearTimestamp={() => setPinnedTimestamp(null)}
                onJumpToTimestamp={(sec) => jumpToTime(sec)}
              />
            </div>
          )}

          {/* TAB 1: Lab Notebook (Role-Aware: Teacher vs Student) */}
          {activeTab === "notebook" && (
            <div id="notebook-section" className="space-y-6">
              {user?.role === "teacher" || user?.role === "admin" ? (
                <TeacherLabNotebook experiment={experiment} locale={locale} />
              ) : (
                <StudentLabNotebook experiment={experiment} locale={locale} />
              )}
            </div>
          )}
        </div>

      {/* EXPLORE NEXT (RECOMMENDED EXPERIMENTS) */}
      {activeTab !== "quiz" && relatedRecommendations.length > 0 && (
        <div className="pt-10 border-t border-slate-200/80 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#142D40]">{labels.exploreNext}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedRecommendations.map((rec, idx) => (
              <ScrollReveal
                key={rec.experiment.id}
                variant="fade-up"
                delayMs={idx * 80}
              >
                <ExperimentCard
                  experiment={rec.experiment}
                  locale={locale}
                  href={
                    pathname.includes("/me/experiments")
                      ? `/${locale}/me/experiments/${rec.experiment.slug}`
                      : pathname.includes("/teacher-dashboard/experiments")
                      ? `/${locale}/teacher-dashboard/experiments/${rec.experiment.slug}`
                      : undefined
                  }
                  isCompleted={state.completedSlugs.includes(
                    rec.experiment.slug
                  )}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function subscribeToLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}
