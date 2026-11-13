import { getAllExperiments } from "@/features/experiments/server-catalog";
import { NextResponse, type NextRequest } from "next/server";
import { readLearningState } from "@/features/progress/server-learning";
import { getPersonalizedRecommendations } from "@/features/recommendations/recommendation-service";
import {
  COLD_START_LEARNER_STATE,
} from "@/features/progress/learning-state";
import { getRequestSessionUser } from "@/features/auth/server-session";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const currentExperimentSlug = searchParams.get("currentExperimentSlug") || undefined;
  const requestedLimit = Number(searchParams.get("limit") ?? 3);
  const limit = Number.isFinite(requestedLimit) ? Math.min(8, Math.max(1, Math.floor(requestedLimit))) : 3;

  // Verify server session: anonymous visitors only receive cold-start / topic-related recommendations
  const sessionUser = await getRequestSessionUser(request);

  const baseState =
    sessionUser ? await readLearningState(sessionUser) : COLD_START_LEARNER_STATE;

  const result = getPersonalizedRecommendations({
    state: baseState,
    catalog: await getAllExperiments(),
    currentExperimentSlug,
    limit,
  });

  return NextResponse.json(result);
}
