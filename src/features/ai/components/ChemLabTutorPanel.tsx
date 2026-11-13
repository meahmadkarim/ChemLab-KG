"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Clock,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  X,
  Bot,
  Check,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import type { Locale } from "@/i18n/config";
import { formatDuration } from "@/i18n/format";
import type { TutorResponsePayload, TutorStyle } from "@/features/ai/service";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestampSeconds?: number | null;
  style?: TutorStyle;
  sources?: string[];
  safetyNotice?: string | null;
  providerMode?: "gemini_live" | "knowledge_base_fallback";
  feedback?: "helpful" | "not_helpful" | null;
}

const UI_COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    clearMoment: string;
    styleLabel: string;
    styles: Record<TutorStyle, string>;
    suggestedLabel: string;
    placeholder: string;
    sendBtn: string;
    clearChat: string;
    thinking: string;
    disclaimer: string;
    helpfulPrompt: string;
    quickActions: {
      whyHappened: string;
      explainSimply: string;
      explainDetail: string;
      askMoment: string;
    };
  }
> = {
  en: {
    title: "Ask ChemLab AI",
    subtitle: "Your chemistry AI bot — ask questions, explore concepts, and discuss experiments.",
    clearMoment: "Clear timestamp",
    styleLabel: "Explanation style:",
    styles: {
      simple: "Explain Simply",
      detailed: "Explain in Detail",
      example: "With an Example",
    },
    suggestedLabel: "Quick questions:",
    placeholder: "Ask ChemLab AI a chemistry question...",
    sendBtn: "Ask",
    clearChat: "Clear chat",
    thinking: "Thinking about your question...",
    disclaimer:
      "Always follow your teacher's laboratory safety instructions when doing chemistry experiments.",
    helpfulPrompt: "Helpful!",
    quickActions: {
      whyHappened: "Why did this happen?",
      explainSimply: "Explain simply",
      explainDetail: "Explain in detail",
      askMoment: "Ask about this video moment",
    },
  },
  ky: {
    title: "ChemLab AI жардамчысы",
    subtitle: "Бул тажрыйба, реакция же видео учуру боюнча каалаган сурооңузду бериңиз.",
    clearMoment: "Убакытты өчүрүү",
    styleLabel: "Түшүндүрүү стили:",
    styles: {
      simple: "Жөнөкөй тилде",
      detailed: "Кененирээк",
      example: "Мисал менен",
    },
    suggestedLabel: "Ыкчам суроолор:",
    placeholder: "Бул реакция боюнча суроо бериңиз...",
    sendBtn: "Суроо",
    clearChat: "Тазалоо",
    thinking: "Жооп даярдалууда...",
    disclaimer:
      "Лабораториялык коопсуздук боюнча мугалимдин көрсөтмөсүн ар дайым так сактаңыз.",
    helpfulPrompt: "Рахмат!",
    quickActions: {
      whyHappened: "Эмне үчүн мындай болду?",
      explainSimply: "Жөнөкөй тил менен түшүндүр",
      explainDetail: "Кененирээк түшүндүр",
      askMoment: "Видеонун ушул учуру боюнча суроо",
    },
  },
  ru: {
    title: "Спросить ChemLab AI",
    subtitle: "Задайте любой вопрос об этом опыте, реакции или моменте видео.",
    clearMoment: "Сбросить таймкод",
    styleLabel: "Стиль объяснения:",
    styles: {
      simple: "Простыми словами",
      detailed: "Подробно",
      example: "С примером",
    },
    suggestedLabel: "Быстрые вопросы:",
    placeholder: "Спросите об этой реакции...",
    sendBtn: "Спросить",
    clearChat: "Очистить",
    thinking: "Готовим понятное объяснение...",
    disclaimer:
      "Всегда соблюдайте правила техники безопасности и указания учителя.",
    helpfulPrompt: "Спасибо!",
    quickActions: {
      whyHappened: "Почему это произошло?",
      explainSimply: "Объясни простыми словами",
      explainDetail: "Объясни подробно",
      askMoment: "Вопрос по этому моменту видео",
    },
  },
};

export function ChemLabTutorPanel({
  experiment,
  locale,
  pinnedTimestamp,
  onClearTimestamp,
  onJumpToTimestamp,
  onCloseMobile,
}: {
  experiment: Experiment;
  locale: Locale;
  pinnedTimestamp: number | null;
  onClearTimestamp: () => void;
  onJumpToTimestamp?: (seconds: number) => void;
  onCloseMobile?: () => void;
}) {
  const copy = UI_COPY[locale];
  const [style, setStyle] = useState<TutorStyle>("simple");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const msgCounterRef = useRef(0);

  useEffect(() => {
    if (messages.length === 0 && !loading) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      isNearBottomRef.current = true;
    }
    if (!isNearBottomRef.current) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function askQuestion(
    questionText: string,
    overrideStyle?: TutorStyle,
    overrideTimestamp?: number | null
  ) {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const chosenStyle = overrideStyle ?? style;
    if (overrideStyle) setStyle(overrideStyle);

    const activeTimestamp =
      overrideTimestamp !== undefined ? overrideTimestamp : pinnedTimestamp;

    msgCounterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${msgCounterRef.current}`,
      role: "user",
      text: trimmed,
      timestampSeconds: activeTimestamp,
      style: chosenStyle,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(35000),
        body: JSON.stringify({
          experimentSlug: experiment.slug,
          question: trimmed,
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            text: m.text,
          })),
          style: chosenStyle,
          timestampSeconds: activeTimestamp,
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const payload = data as TutorResponsePayload;
      msgCounterRef.current += 1;
      const assistantMsg: ChatMessage = {
        id: `a-${msgCounterRef.current}`,
        role: "assistant",
        text: payload.answer,
        timestampSeconds: payload.relatedTimestampSeconds,
        style: payload.style,
        sources: payload.referencedSources,
        safetyNotice: payload.safetyNotice,
        providerMode: payload.providerMode,
        feedback: null,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach AI Tutor");
    } finally {
      setLoading(false);
    }
  }

  async function handleFeedback(
    msgId: string,
    rating: "helpful" | "not_helpful"
  ) {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback: rating } : m))
    );
    try {
      await fetch("/api/ai/response-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentSlug: experiment.slug,
          messageId: msgId,
          rating,
        }),
      });
    } catch {
      // Ignore network errors
    }
  }

  return (
    <aside
      aria-label={copy.title}
      className="bg-white rounded-3xl border border-[#142D40]/10 flex flex-col overflow-hidden h-[580px] max-h-[80vh]"
    >
      {/* Calm Header */}
      <div className="bg-[#EAE3F5]/65 px-6 py-4 border-b border-[#142D40]/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-2xl bg-[#142D40] text-white">
            <Bot className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#142D40] truncate">
              {copy.title}
            </h3>
            <p className="text-xs text-[#536574] truncate">
              {experiment.title[locale]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              title={copy.clearChat}
              className="inline-flex w-9 h-9 items-center justify-center rounded-xl text-[#536574] hover:text-[#142D40] hover:bg-white/70 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close tutor"
              className="lg:hidden inline-flex w-9 h-9 items-center justify-center rounded-xl text-[#536574] hover:text-[#142D40] hover:bg-white/70 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Style Selector Bar */}
      <div className="bg-[#F8F7F4] px-6 py-3 border-b border-[#142D40]/10 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#536574]">
            {copy.styleLabel}
          </span>
          {pinnedTimestamp !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#142D40]/15 px-3 py-0.5 text-xs font-mono font-bold text-[#142D40]">
              <Clock className="w-3 h-3 text-[#087F8C]" />
              {formatDuration(pinnedTimestamp)}
              <button
                type="button"
                onClick={onClearTimestamp}
                aria-label={copy.clearMoment}
                className="hover:text-[#B91C1C] ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        <div
          className="grid grid-cols-3 gap-2"
          role="group"
          aria-label={copy.styleLabel}
        >
          {(["simple", "detailed", "example"] as TutorStyle[]).map((mode) => {
            const active = style === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setStyle(mode)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer truncate ${
                  active
                    ? "bg-[#142D40] text-white"
                    : "bg-white text-[#536574] border border-[#142D40]/12 hover:text-[#142D40]"
                }`}
              >
                {copy.styles[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Stream */}
      <div
        ref={messagesContainerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
        className="flex-1 overflow-y-auto overscroll-y-contain p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="space-y-5">
            <p className="text-sm text-[#536574] leading-relaxed">
              {copy.subtitle}
            </p>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#536574]">
                {copy.suggestedLabel}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    askQuestion(copy.quickActions.whyHappened, "simple")
                  }
                  className="text-left rounded-2xl border border-[#142D40]/12 bg-[#F8F7F4] hover:border-[#087F8C] px-4 py-3 text-sm font-bold text-[#142D40] transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{copy.quickActions.whyHappened}</span>
                  <Sparkles className="w-4 h-4 text-[#087F8C] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    askQuestion(copy.quickActions.explainSimply, "simple")
                  }
                  className="text-left rounded-2xl border border-[#142D40]/12 bg-[#F8F7F4] hover:border-[#087F8C] px-4 py-3 text-sm font-bold text-[#142D40] transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{copy.quickActions.explainSimply}</span>
                  <Sparkles className="w-4 h-4 text-[#087F8C] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    askQuestion(copy.quickActions.explainDetail, "detailed")
                  }
                  className="text-left rounded-2xl border border-[#142D40]/12 bg-[#F8F7F4] hover:border-[#087F8C] px-4 py-3 text-sm font-bold text-[#142D40] transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{copy.quickActions.explainDetail}</span>
                  <Sparkles className="w-4 h-4 text-[#087F8C] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    askQuestion(
                      copy.quickActions.askMoment,
                      "simple",
                      pinnedTimestamp ?? 15
                    )
                  }
                  className="text-left rounded-2xl border border-[#142D40]/12 bg-[#F8F7F4] hover:border-[#087F8C] px-4 py-3 text-sm font-bold text-[#142D40] transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{copy.quickActions.askMoment}</span>
                  <Clock className="w-4 h-4 text-[#087F8C] shrink-0" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#142D40] text-white"
                    : "bg-[#F8F7F4] border border-[#142D40]/10 text-[#142D40] space-y-2.5"
                }`}
              >
                {msg.timestampSeconds !== null &&
                  msg.timestampSeconds !== undefined && (
                    <button
                      type="button"
                      onClick={() =>
                        onJumpToTimestamp?.(msg.timestampSeconds!)
                      }
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-mono font-bold cursor-pointer ${
                        msg.role === "user"
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#142D40] border border-[#142D40]/15 hover:underline"
                      }`}
                    >
                      <Clock className="w-3 h-3 text-[#087F8C]" />
                      {formatDuration(msg.timestampSeconds)}
                    </button>
                  )}

                {msg.role === "assistant" && <p className="text-[11px] font-semibold text-[#536574]">{msg.providerMode === "gemini_live" ? "ChemLab AI · Live AI" : "ChemLab AI · Reference mode (live AI unavailable)"}</p>}
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.role === "assistant" && msg.safetyNotice && (
                  <div className="rounded-xl bg-[#F7DED0]/65 border border-[#142D40]/10 p-3 text-xs text-[#142D40] flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-[#142D40] mt-0.5" />
                    <span>{msg.safetyNotice}</span>
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div className="flex items-center justify-end gap-1 pt-1 text-xs text-[#536574]">
                    {msg.feedback ? (
                      <span className="inline-flex items-center gap-1 text-[#15803D] font-bold">
                        <Check className="w-3.5 h-3.5" />
                        {copy.helpfulPrompt}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, "helpful")}
                          aria-label="Helpful"
                          className="p-1 rounded hover:bg-white hover:text-[#15803D] cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, "not_helpful")}
                          aria-label="Not helpful"
                          className="p-1 rounded hover:bg-white hover:text-[#B91C1C] cursor-pointer"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 p-4 text-xs font-bold text-[#536574] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#087F8C] animate-ping" />
            <span>{copy.thinking}</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-[#F7DED0] border border-[#B91C1C]/30 p-3.5 text-xs font-bold text-[#B91C1C]">
            {error}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[#142D40]/10 bg-white space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askQuestion(input);
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask ChemLab AI"
            placeholder={copy.placeholder}
            maxLength={400}
            className="flex-1 rounded-full border border-[#142D40]/15 bg-[#F8F7F4] px-4 py-2.5 text-sm text-[#142D40] placeholder:text-[#536574]/70 focus:outline-none focus:border-[#087F8C] focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white text-sm font-bold disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{copy.sendBtn}</span>
          </button>
        </form>
        <p className="text-[11px] text-[#536574] leading-tight px-1">
          {copy.disclaimer}
        </p>
      </div>
    </aside>
  );
}
