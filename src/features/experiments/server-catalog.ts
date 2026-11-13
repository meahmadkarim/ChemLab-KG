import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import type { Experiment } from "./types";
export { TOPICS, getTopicById } from "./data";

export async function getAllExperiments(): Promise<Experiment[]> {
  "use cache";
  cacheTag("experiment-catalog");
  cacheLife("minutes");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Configure Supabase before loading the published catalog.");
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.from("experiment_publications").select("data").eq("status", "published").order("slug");
  if (error) throw new Error("The experiment catalog is temporarily unavailable.");
  return data.map(row => row.data as Experiment);
}

export async function getExperimentBySlug(slug: string) {
  return (await getAllExperiments()).find(experiment => experiment.slug === slug);
}

export async function getFeaturedExperiments() {
  return (await getAllExperiments()).filter(experiment => experiment.featured);
}
