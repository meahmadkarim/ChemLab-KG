import type { Locale } from "@/i18n/config";

export type TopicId =
  | "acids-bases"
  | "reactions"
  | "gases"
  | "metals"
  | "solutions"
  | "separation"
  | "electrochemistry"
  | "energy";

export type SafetyLevel = "observe" | "teacher_demo" | "student_lab";

export type IllustrationVariant =
  | "indicator-flask"
  | "peroxide-foam"
  | "electrolysis-tubes"
  | "copper-displacement"
  | "crystal-lattice"
  | "chromatography-strip"
  | "flame-spectrum"
  | "gas-splint";

export interface TopicInfo {
  id: TopicId;
  iconName: string;
  accentColor: string;
  softBg: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export interface ProcedureStep {
  timeSeconds: number;
  title: Record<Locale, string>;
  detail: Record<Locale, string>;
}

export type ProcedureReviewStatus = "verified" | "under_review";

export interface DetailedProcedureStep {
  stepNumber: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  materialsUsed?: Record<Locale, string[]>;
  observation?: Record<Locale, string>;
  safetyNote?: Record<Locale, string>;
  isTeacherSupervised?: boolean;
}

export interface ExperimentProcedure {
  experimentId: string;
  slug: string;
  reviewStatus: ProcedureReviewStatus;
  introduction: Record<Locale, string>;
  teacherSupervised: boolean;
  supervisionNotice?: Record<Locale, string>;
  safetyOverview?: Record<Locale, string>;
  steps: DetailedProcedureStep[];
}

export interface TranscriptSegment {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: Record<Locale, string>;
}

export interface QuizOption {
  id: string;
  text: Record<Locale, string>;
  isCorrect: boolean;
  explanation: Record<Locale, string>;
  /** Teacher-authored misconception identifier for wrong options */
  misconceptionTag?: string;
  /** Human-readable misconception summary by locale */
  misconceptionLabel?: Record<Locale, string>;
}

export interface QuizQuestion {
  id: string;
  prompt: Record<Locale, string>;
  conceptTag?: TopicId;
  hint?: Record<Locale, string>;
  options: QuizOption[];
}

export interface Experiment {
  id: string;
  slug: string;
  topicId: TopicId;
  durationSeconds: number;
  safetyLevel: SafetyLevel;
  featured: boolean;
  /** Supports either a full YouTube URL or an 11-character YouTube video ID */
  youtubeVideo: string;
  chemicalEquation: string;
  illustration: IllustrationVariant;
  title: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  objectives: Record<Locale, string[]>;
  materials: Record<Locale, string[]>;
  safetyNotes: Record<Locale, string[]>;
  scientificExplanation: Record<Locale, string[]>;
  steps: ProcedureStep[];
  procedure?: ExperimentProcedure;
  quiz: QuizQuestion[];
  transcriptSegments?: TranscriptSegment[];
}

/**
 * Extracts a clean YouTube video ID from either a raw ID or any standard YouTube URL
 * (watch?v=, youtu.be/, embed/, shorts/).
 */
export function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.hostname === "youtu.be") {
      return url.pathname.replace("/", "").slice(0, 11);
    }
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(url.hostname)) return "";
    const vParam = url.searchParams.get("v");
    if (vParam) {
      return vParam.slice(0, 11);
    }
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIdx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "v");
    if (embedIdx !== -1 && parts[embedIdx + 1]) {
      return parts[embedIdx + 1].slice(0, 11);
    }
  } catch {
    // Fallback regex match if URL constructor fails
  }
  const match = trimmed.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : trimmed;
}
