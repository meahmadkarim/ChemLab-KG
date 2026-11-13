import { promises as fs } from "fs";
import path from "path";
import { EXPERIMENTS } from "@/features/experiments/data";
import type { TopicId } from "@/features/experiments/types";
import type { SessionUser } from "@/features/auth/server-session";
import type { Locale } from "@/i18n/config";

const DATA_DIR = path.join(process.cwd(), ".data");
const QUESTIONS_FILE = path.join(DATA_DIR, "teacher-questions.json");

export interface QuestionBankItem {
  id: string;
  topicId: TopicId;
  experimentSlug: string;
  experimentTitle: string;
  prompt: Record<Locale, string>;
  options: Array<{
    id: string;
    text: Record<Locale, string>;
    isCorrect: boolean;
    explanation: Record<Locale, string>;
    misconceptionTag?: string;
  }>;
  hint?: Record<Locale, string>;
  isTeacherAuthored?: boolean;
  isArchived?: boolean;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
}

let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function readStore(): Promise<Record<string, QuestionBankItem>> {
  try {
    const raw = await fs.readFile(QUESTIONS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeStore(data: Record<string, QuestionBankItem>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${QUESTIONS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, QUESTIONS_FILE);
}

/**
 * Get all questions for a topic (standard curriculum + teacher-authored/edited)
 */
export async function getTopicQuestionBank(topicId: string, user: SessionUser): Promise<QuestionBankItem[]> {
  const matchingExperiments = EXPERIMENTS.filter((exp) => exp.topicId === topicId);
  const baseItems: QuestionBankItem[] = [];

  for (const exp of matchingExperiments) {
    for (const q of exp.quiz) {
      baseItems.push({
        id: q.id,
        topicId: exp.topicId,
        experimentSlug: exp.slug,
        experimentTitle: exp.title.en,
        prompt: q.prompt,
        options: q.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          explanation: opt.explanation,
          misconceptionTag: opt.misconceptionTag,
        })),
        hint: q.hint,
        isTeacherAuthored: false,
        isArchived: false,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      });
    }
  }

  // Load teacher overrides and custom questions
  const customStore = user.isDemo ? await readStore() : {};
  const mergedMap = new Map<string, QuestionBankItem>();

  for (const item of baseItems) {
    mergedMap.set(`${item.experimentSlug}:${item.id}`, item);
  }

  for (const item of Object.values(customStore)) {
    if (item.topicId === topicId && item.authorId === user.id) {
      mergedMap.set(`${item.experimentSlug}:${item.id}`, item);
    }
  }

  // Filter out archived questions and return
  return Array.from(mergedMap.values()).filter((item) => !item.isArchived);
}

/**
 * Save or update a question
 */
export async function saveQuestionBankItem(
  teacher: SessionUser,
  input: {
    id?: string;
    topicId: TopicId;
    experimentSlug: string;
    promptText: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      explanation: string;
    }>;
  }
): Promise<QuestionBankItem> {
  const now = new Date().toISOString();
  const id = input.id || `custom-q-${Date.now()}`;
  const store = await readStore();
  const existing = store[id];

  const exp = EXPERIMENTS.find((e) => e.slug === input.experimentSlug);
  const experimentTitle = exp?.title.en || input.experimentSlug;

  const item: QuestionBankItem = {
    id,
    topicId: input.topicId,
    experimentSlug: input.experimentSlug,
    experimentTitle,
    prompt: {
      en: input.promptText,
      ky: existing?.prompt?.ky || input.promptText,
      ru: existing?.prompt?.ru || input.promptText,
    },
    options: input.options.map((opt) => ({
      id: opt.id,
      text: {
        en: opt.text,
        ky: opt.text,
        ru: opt.text,
      },
      isCorrect: opt.isCorrect,
      explanation: {
        en: opt.explanation,
        ky: opt.explanation,
        ru: opt.explanation,
      },
    })),
    isTeacherAuthored: existing ? existing.isTeacherAuthored : true,
    isArchived: false,
    authorId: teacher.id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await enqueue(async () => {
    store[id] = item;
    await writeStore(store);
  });

  return item;
}

/**
 * Archive / delete a question
 */
export async function archiveQuestionBankItem(
  teacher: SessionUser,
  questionId: string
): Promise<boolean> {
  const store = await readStore();
  const existing = store[questionId];

  await enqueue(async () => {
    if (existing) {
      existing.isArchived = true;
      existing.updatedAt = new Date().toISOString();
      store[questionId] = existing;
    } else {
      // Find standard question and mark as archived override
      for (const exp of EXPERIMENTS) {
        const found = exp.quiz.find((q) => q.id === questionId);
        if (found) {
          store[questionId] = {
            id: found.id,
            topicId: exp.topicId,
            experimentSlug: exp.slug,
            experimentTitle: exp.title.en,
            prompt: found.prompt,
            options: found.options,
            hint: found.hint,
            isTeacherAuthored: false,
            isArchived: true,
            authorId: teacher.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          break;
        }
      }
    }
    await writeStore(store);
  });

  return true;
}
