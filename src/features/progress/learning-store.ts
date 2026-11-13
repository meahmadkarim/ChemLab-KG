"use client";

import { useState, useEffect, useCallback } from "react";
import type { TopicId } from "@/features/experiments/types";
import { loadCachedAuthSession } from "@/features/auth/auth-store";

import { INITIAL_ACTIVE_LEARNER_STATE, COLD_START_LEARNER_STATE } from "./learning-state";
import type { QuizQuestionResponseRecord, QuizAttemptRecord, TeacherQuizPermissions, ClassroomAssignment, StudentLearningState } from "./learning-state";
export type { QuizQuestionResponseRecord, QuizAttemptRecord, TeacherQuizPermissions, ClassroomAssignment, ClassroomRecord, StudentLearningState } from "./learning-state";
export { INITIAL_ACTIVE_LEARNER_STATE, COLD_START_LEARNER_STATE, DEFAULT_CLASSROOMS } from "./learning-state";

const BASE_STORAGE_KEY = "chemlab_kg_learning_state_v2";

function getStorageKeyForActiveUser(): {
  key: string | null;
  defaultState: StudentLearningState;
} {
  const user = loadCachedAuthSession();
  if (!user) {
    // Anonymous visitors never receive fake student progress
    return {
      key: null,
      defaultState: COLD_START_LEARNER_STATE,
    };
  }
  if (user.isDemo) {
    return {
      key: `${BASE_STORAGE_KEY}_demo_${user.id}`,
      defaultState: INITIAL_ACTIVE_LEARNER_STATE,
    };
  }
  return {
    key: `${BASE_STORAGE_KEY}_user_${user.id}`,
    defaultState: COLD_START_LEARNER_STATE,
  };
}

export function loadLearningState(): StudentLearningState {
  if (typeof window === "undefined") {
    return COLD_START_LEARNER_STATE;
  }
  const { key, defaultState } = getStorageKeyForActiveUser();
  if (!key) return COLD_START_LEARNER_STATE;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<StudentLearningState>;
    return {
      ...defaultState,
      ...parsed,
      classrooms: Array.isArray(parsed.classrooms) ? parsed.classrooms : defaultState.classrooms,
    };
  } catch {
    return defaultState;
  }
}

// Serialize this tab's preference writes so a slower old response cannot overwrite
// a newer bookmark/interest selection. The database remains the source of truth.
let preferenceWrites: Promise<void> = Promise.resolve();

export function saveLearningState(state: StudentLearningState): void {
  if (typeof window === "undefined") return;
  const { key } = getStorageKeyForActiveUser();
  const user = loadCachedAuthSession();
  if (!key || !user) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("chemlab-learning-state-updated"));
  } catch {
    window.dispatchEvent(new CustomEvent("chemlab-save-error"));
  }
  if (user.isDemo) return;
  const body = JSON.stringify({ viewedSlugs: state.viewedSlugs, bookmarkedSlugs: state.bookmarkedSlugs, explicitInterests: state.explicitInterests });
  preferenceWrites = preferenceWrites.then(async () => {
    if (loadCachedAuthSession()?.id !== user.id) return;
    const response = await fetch("/api/learning", { method: "PUT", headers: { "Content-Type": "application/json" }, body });
    if (!response.ok) throw new Error("Preferences were not saved.");
    if (loadCachedAuthSession()?.id === user.id) window.dispatchEvent(new CustomEvent("chemlab-save-success"));
  }).catch(() => {
    if (loadCachedAuthSession()?.id === user.id) window.dispatchEvent(new CustomEvent("chemlab-save-error"));
  });
}

async function classroomCommand(command: object): Promise<void> {
  const response = await fetch("/api/classrooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(command) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Unable to save classroom.");
  window.dispatchEvent(new CustomEvent("chemlab-auth-updated"));
}

export function useLearningStore() {
  const [state, setState] = useState<StudentLearningState>(COLD_START_LEARNER_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const handleStorageOrAuthChange = () => {
      setState(loadLearningState());
      setHydrated(true);
    };
    let active = true;
    const loadServer = async () => {
      handleStorageOrAuthChange();
      const user = loadCachedAuthSession();
      if (!user || user.isDemo) return;
      const response = await fetch("/api/learning", { cache: "no-store" }).catch(() => null);
      if (!active || !response?.ok) return;
      const data = await response.json();
      if (loadCachedAuthSession()?.id !== user.id) return;
      const { key } = getStorageKeyForActiveUser();
      if (key) window.localStorage.setItem(key, JSON.stringify(data.state));
      window.dispatchEvent(new CustomEvent("chemlab-learning-state-updated"));
    };
    const timer = window.setTimeout(() => void loadServer(), 0);
    window.addEventListener("chemlab-learning-state-updated", handleStorageOrAuthChange);
    window.addEventListener("chemlab-auth-updated", loadServer);
    return () => {
      active = false;
      window.clearTimeout(timer);
      window.removeEventListener(
        "chemlab-learning-state-updated",
        handleStorageOrAuthChange
      );
      window.removeEventListener("chemlab-auth-updated", loadServer);
    };
  }, []);

  const updateState = useCallback(
    (updater: (prev: StudentLearningState) => StudentLearningState) => {
      const next = updater(loadLearningState());
      saveLearningState(next);
      setState(next);
    },
    []
  );

  const recordExperimentView = useCallback(
    (slug: string) => {
      updateState((prev) => {
        if (prev.viewedSlugs.includes(slug)) return prev;
        return {
          ...prev,
          viewedSlugs: [slug, ...prev.viewedSlugs],
        };
      });
    },
    [updateState]
  );

  const toggleBookmark = useCallback(
    (slug: string) => {
      updateState((prev) => {
        const exists = prev.bookmarkedSlugs.includes(slug);
        return {
          ...prev,
          bookmarkedSlugs: exists
            ? prev.bookmarkedSlugs.filter((s) => s !== slug)
            : [slug, ...prev.bookmarkedSlugs],
        };
      });
    },
    [updateState]
  );

  const recordQuizAttempt = useCallback(
    async (attempt: Omit<QuizAttemptRecord, "id" | "completedAt">) => {
      const user = loadCachedAuthSession();
      if (user && !user.isDemo) {
        const response = await fetch("/api/quiz/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(attempt) });
        if (!response.ok) throw new Error("Unable to save quiz result. Please try again.");
        const submitted = await response.json();
        const refresh = await fetch("/api/learning", { cache: "no-store" });
        if (!refresh.ok) throw new Error("Result saved, but progress could not be refreshed.");
        const data = await refresh.json();
        const { key } = getStorageKeyForActiveUser();
        if (key) window.localStorage.setItem(key, JSON.stringify(data.state));
        setState(data.state);
        window.dispatchEvent(new CustomEvent("chemlab-learning-state-updated"));
        return submitted.attempt.responses as QuizQuestionResponseRecord[];
      }
      updateState((prev) => {
        const fullAttempt: QuizAttemptRecord = {
          ...attempt,
          id: `att-${Date.now()}`,
          completedAt: new Date().toISOString(),
        };
        const completedSlugs = prev.completedSlugs.includes(attempt.experimentSlug)
          ? prev.completedSlugs
          : [attempt.experimentSlug, ...prev.completedSlugs];
        const viewedSlugs = prev.viewedSlugs.includes(attempt.experimentSlug)
          ? prev.viewedSlugs
          : [attempt.experimentSlug, ...prev.viewedSlugs];
        return {
          ...prev,
          profileMode: "active_learner",
          viewedSlugs,
          completedSlugs,
          quizAttempts: [fullAttempt, ...prev.quizAttempts],
        };
      });
    },
    [updateState]
  );

  const switchProfileMode = useCallback(
    (mode: "active_learner" | "cold_start") => {
      if (!loadCachedAuthSession()?.isDemo) return;
      const next =
        mode === "cold_start"
          ? COLD_START_LEARNER_STATE
          : INITIAL_ACTIVE_LEARNER_STATE;
      saveLearningState(next);
      setState(next);
    },
    []
  );

  const toggleTopicInterest = useCallback(
    (topicId: TopicId) => {
      updateState((prev) => {
        const exists = prev.explicitInterests.includes(topicId);
        return {
          ...prev,
          explicitInterests: exists
            ? prev.explicitInterests.filter((t) => t !== topicId)
            : [...prev.explicitInterests, topicId],
        };
      });
    },
    [updateState]
  );

  const updateAssignmentPermissions = useCallback(
    async (
      classroomId: string,
      assignmentId: string,
      permissions: TeacherQuizPermissions
    ) => {
      if (!loadCachedAuthSession()?.isDemo) return classroomCommand({ action: "permissions", assignmentId, permissions });
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.map((cls) =>
          cls.id !== classroomId
            ? cls
            : {
                ...cls,
                assignments: cls.assignments.map((asgn) =>
                  asgn.id !== assignmentId ? asgn : { ...asgn, permissions }
                ),
              }
        ),
      }));
    },
    [updateState]
  );

  const createAssignment = useCallback(
    async (
      classroomId: string,
      assignment: Omit<ClassroomAssignment, "id" | "classroomId">
    ) => {
      if (!loadCachedAuthSession()?.isDemo) return classroomCommand({ action: "assign", classroomId, ...assignment });
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.map((cls) =>
          cls.id !== classroomId
            ? cls
            : {
                ...cls,
                assignments: [
                  {
                    ...assignment,
                    id: `asgn-${Date.now()}`,
                    classroomId,
                  },
                  ...cls.assignments,
                ],
              }
        ),
      }));
    },
    [updateState]
  );

  const createClassroom = useCallback(
    async (params: { name: string; teacherName: string; joinCode?: string }) => {
      if (!loadCachedAuthSession()?.isDemo) return classroomCommand({ action: "create", name: params.name });
      const cleanedName = params.name.trim();
      if (!cleanedName) return;
      const code =
        params.joinCode?.trim().toUpperCase() ||
        `KG${Math.abs(cleanedName.length * 137 + prevCountSeed(cleanedName))
          .toString(36)
          .toUpperCase()
          .slice(0, 4)}`;
      updateState((prev) => ({
        ...prev,
        classrooms: [
          {
            id: `cls-${prev.classrooms.length + 1}-${code.toLowerCase()}`,
            name: cleanedName,
            teacherName: params.teacherName.trim() || "Chemistry Teacher",
            joinCode: code,
            studentCount: 1,
            assignments: [],
          },
          ...prev.classrooms,
        ],
      }));
    },
    [updateState]
  );

  const editClassroom = useCallback(
    async (classroomId: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      if (!loadCachedAuthSession()?.isDemo) {
        await classroomCommand({ action: "edit", classroomId, name: trimmed });
      }
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.map((cls) =>
          cls.id === classroomId ? { ...cls, name: trimmed } : cls
        ),
      }));
    },
    [updateState]
  );

  const archiveClassroom = useCallback(
    async (classroomId: string, archived: boolean) => {
      if (!loadCachedAuthSession()?.isDemo) {
        await classroomCommand({ action: "archive", classroomId, archived });
      }
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.map((cls) =>
          cls.id === classroomId ? { ...cls, archived } : cls
        ),
      }));
    },
    [updateState]
  );

  const deleteClassroom = useCallback(
    async (classroomId: string) => {
      if (!loadCachedAuthSession()?.isDemo) {
        await classroomCommand({ action: "delete", classroomId });
      }
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.filter((cls) => cls.id !== classroomId),
      }));
    },
    [updateState]
  );

  const leaveClassroom = useCallback(
    async (classroomId: string) => {
      if (!loadCachedAuthSession()?.isDemo) {
        await classroomCommand({ action: "leave", classroomId });
      }
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.filter((cls) => cls.id !== classroomId),
      }));
    },
    [updateState]
  );

  const rotateJoinCode = useCallback(
    async (classroomId: string) => {
      if (!loadCachedAuthSession()?.isDemo) {
        await classroomCommand({ action: "rotate", classroomId });
        return;
      }
      const newCode = `KG${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.map((cls) =>
          cls.id === classroomId ? { ...cls, joinCode: newCode } : cls
        ),
      }));
    },
    [updateState]
  );

  const updateAssignmentDeadline = useCallback(
    async (classroomId: string, assignmentId: string, dueDate: string) => {
      if (!loadCachedAuthSession()?.isDemo) {
        await classroomCommand({ action: "deadline", assignmentId, dueDate });
        return;
      }
      updateState((prev) => ({
        ...prev,
        classrooms: prev.classrooms.map((cls) =>
          cls.id !== classroomId
            ? cls
            : {
                ...cls,
                assignments: cls.assignments.map((asgn) =>
                  asgn.id !== assignmentId ? asgn : { ...asgn, dueDate }
                ),
              }
        ),
      }));
    },
    [updateState]
  );

  return {
    state,
    hydrated,
    recordExperimentView,
    toggleBookmark,
    recordQuizAttempt,
    switchProfileMode,
    toggleTopicInterest,
    updateAssignmentPermissions,
    createAssignment,
    createClassroom,
    editClassroom,
    archiveClassroom,
    deleteClassroom,
    leaveClassroom,
    rotateJoinCode,
    updateAssignmentDeadline,
    joinClassroom: (code: string) => classroomCommand({ action: "join", code }),
  };
}

function prevCountSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
