import { z } from "zod";
import { extractYouTubeId } from "./types";
const text = z.string().trim().min(1).max(12000);
const localized = z.object({ en: text, ru: text, ky: text });
const lines = z.object({ en: z.array(text).min(1).max(40), ru: z.array(text).min(1).max(40), ky: z.array(text).min(1).max(40) });
const topic = z.enum(["acids-bases","reactions","gases","metals","solutions","separation","electrochemistry","energy"]);
const option = z.object({ id: z.string().min(1).max(80), text: localized, isCorrect: z.boolean(), explanation: localized, misconceptionTag: z.string().max(120).optional(), misconceptionLabel: localized.optional() });
const question = z.object({ id: z.string().min(1).max(80), prompt: localized, conceptTag: topic.optional(), hint: localized.optional(), options: z.array(option).min(2).max(6) }).refine(q => q.options.filter(o => o.isCorrect).length === 1 && new Set(q.options.map(o => o.id)).size === q.options.length, "Each question needs unique options and one correct answer.");
const step = z.object({ timeSeconds: z.number().int().min(0), title: localized, detail: localized });
const procedureStep = z.object({ stepNumber: z.number().int().positive(), title: localized, description: localized, materialsUsed: lines.optional(), observation: localized.optional(), safetyNote: localized.optional(), isTeacherSupervised: z.boolean().optional() });
export const experimentEditorSchema = z.object({
 id: z.string().min(1).max(160), slug: z.string().max(160).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/), topicId: topic,
 durationSeconds: z.number().int().min(1).max(14400), safetyLevel: z.enum(["observe","teacher_demo","student_lab"]), featured: z.boolean(),
 youtubeVideo: z.string().max(500).transform(extractYouTubeId).refine(id => /^[\w-]{11}$/.test(id), "Enter a valid YouTube URL or video ID."), chemicalEquation: z.string().max(500),
 illustration: z.enum(["indicator-flask","peroxide-foam","electrolysis-tubes","copper-displacement","crystal-lattice","chromatography-strip","flame-spectrum","gas-splint"]),
 title: localized, shortDescription: localized, objectives: lines, materials: lines, safetyNotes: lines, scientificExplanation: lines,
 steps: z.array(step).min(1).max(60), quiz: z.array(question).min(1).max(20),
 transcriptSegments: z.array(z.object({ id: z.string().min(1), startSeconds: z.number().min(0), endSeconds: z.number().min(0), text: localized }).refine(s => s.endSeconds >= s.startSeconds)).max(500).optional(),
 procedure: z.object({ experimentId: z.string(), slug: z.string(), reviewStatus: z.enum(["verified","under_review"]), introduction: localized, teacherSupervised: z.boolean(), supervisionNotice: localized.optional(), safetyOverview: localized.optional(), steps: z.array(procedureStep).max(60) }).optional(),
}).refine(e => new Set(e.quiz.map(q => q.id)).size === e.quiz.length, "Question IDs must be unique.");
export const catalogSaveSchema = z.object({ experiment: experimentEditorSchema, status: z.enum(["draft","published","archived"]), updatedAt: z.string().datetime({ offset: true }).nullable() });
