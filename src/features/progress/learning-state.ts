import type { TopicId } from "@/features/experiments/types";

export interface QuizQuestionResponseRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  conceptTag?: TopicId;
  misconceptionTag?: string;
}

export interface QuizAttemptRecord {
  id: string;
  experimentSlug: string;
  topicId: TopicId;
  score: number;
  total: number;
  completedAt: string;
  assignmentId?: string;
  responses: QuizQuestionResponseRecord[];
}

export interface TeacherQuizPermissions {
  allowHints: boolean;
  allowAiExplanations: boolean;
  showImmediateFeedback: boolean;
  showCorrectAnswers: boolean;
  allowRetries: boolean;
}

export interface ClassroomAssignment {
  id: string;
  classroomId: string;
  experimentSlug: string;
  dueDate: string;
  permissions: TeacherQuizPermissions;
}

export interface ClassroomRecord {
  id: string;
  name: string;
  teacherName: string;
  joinCode: string;
  studentCount: number;
  assignments: ClassroomAssignment[];
  archived?: boolean;
}

export interface StudentLearningState {
  teacherProgress?: { id: string; name: string; completed: string; quizScore: string; status: string; statusTone: string }[];
  profileMode: "active_learner" | "cold_start";
  viewedSlugs: string[];
  completedSlugs: string[];
  bookmarkedSlugs: string[];
  explicitInterests: TopicId[];
  quizAttempts: QuizAttemptRecord[];
  classrooms: ClassroomRecord[];
}

export const DEFAULT_CLASSROOMS: ClassroomRecord[] = [
  {
    id: "cls-naryn-01",
    name: "Naryn Lyceum · Practical Chemistry Lab",
    teacherName: "Aigul Asanova",
    joinCode: "NARYN7",
    studentCount: 26,
    assignments: [
      {
        id: "asgn-01",
        classroomId: "cls-naryn-01",
        experimentSlug: "red-cabbage-ph-indicator",
        dueDate: "2026-11-20",
        permissions: {
          allowHints: true,
          allowAiExplanations: true,
          showImmediateFeedback: true,
          showCorrectAnswers: true,
          allowRetries: true,
        },
      },
      {
        id: "asgn-02",
        classroomId: "cls-naryn-01",
        experimentSlug: "electrolysis-of-water-hoffman",
        dueDate: "2026-11-25",
        permissions: {
          allowHints: true,
          allowAiExplanations: true,
          showImmediateFeedback: true,
          showCorrectAnswers: false,
          allowRetries: true,
        },
      },
    ],
  },
  {
    id: "cls-bishkek-02",
    name: "Bishkek STEM Gymnasium · Redox & Catalysis",
    teacherName: "Bakytbekov T.",
    joinCode: "STEM24",
    studentCount: 29,
    assignments: [
      {
        id: "asgn-03",
        classroomId: "cls-bishkek-02",
        experimentSlug: "catalytic-decomposition-hydrogen-peroxide",
        dueDate: "2026-11-28",
        permissions: {
          allowHints: false,
          allowAiExplanations: true,
          showImmediateFeedback: true,
          showCorrectAnswers: true,
          allowRetries: false,
        },
      },
    ],
  },
];

export const INITIAL_ACTIVE_LEARNER_STATE: StudentLearningState = {
  profileMode: "active_learner",
  viewedSlugs: [
    "red-cabbage-ph-indicator",
    "catalytic-decomposition-hydrogen-peroxide",
    "electrolysis-of-water-hoffman",
  ],
  completedSlugs: [
    "red-cabbage-ph-indicator",
    "catalytic-decomposition-hydrogen-peroxide",
  ],
  bookmarkedSlugs: [
    "red-cabbage-ph-indicator",
    "flame-tests-metal-cations",
  ],
  explicitInterests: ["acids-bases", "reactions", "electrochemistry"],
  quizAttempts: [
    {
      id: "att-demo-1",
      experimentSlug: "red-cabbage-ph-indicator",
      topicId: "acids-bases",
      score: 2,
      total: 2,
      completedAt: "2026-11-11T14:20:00Z",
      responses: [
        {
          questionId: "q1",
          selectedOptionId: "b",
          isCorrect: true,
          conceptTag: "acids-bases",
        },
        {
          questionId: "q2",
          selectedOptionId: "a",
          isCorrect: true,
          conceptTag: "acids-bases",
        },
      ],
    },
    {
      id: "att-demo-2",
      experimentSlug: "electrolysis-of-water-hoffman",
      topicId: "electrochemistry",
      score: 2,
      total: 3,
      completedAt: "2026-11-12T10:15:00Z",
      responses: [
        {
          questionId: "q1",
          selectedOptionId: "a",
          isCorrect: true,
          conceptTag: "electrochemistry",
        },
        {
          questionId: "q2",
          selectedOptionId: "a",
          isCorrect: true,
          conceptTag: "electrochemistry",
        },
        {
          questionId: "q3",
          selectedOptionId: "c",
          isCorrect: false,
          conceptTag: "electrochemistry",
          misconceptionTag: "anode_cathode_gas_swap",
        },
      ],
    },
  ],
  classrooms: DEFAULT_CLASSROOMS,
};

export const COLD_START_LEARNER_STATE: StudentLearningState = {
  profileMode: "cold_start",
  viewedSlugs: [],
  completedSlugs: [],
  bookmarkedSlugs: [],
  explicitInterests: [],
  quizAttempts: [],
  classrooms: [],
};

