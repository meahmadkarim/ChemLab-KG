

export type LabReportMode = "video_observation" | "supervised_lab";
export type LabReportStatus = "draft" | "submitted" | "reviewed";

export interface LabProcedureStep {
  id: string;
  stepNumber: number;
  text: string;
  source: "video_observation" | "personally_performed";
}

export interface StudentLabReport {
  id: string;
  userId: string;
  userDisplayName?: string;
  studentName?: string;
  experimentSlug: string;
  assignmentId?: string | null;
  mode: LabReportMode;
  aim: string;
  researchQuestion: string;
  hypothesis: string;
  procedureSteps: LabProcedureStep[];
  observations: string;
  results: string;
  conclusion: string;
  status: LabReportStatus;
  teacherFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LabReportSaveInput = {
  experimentSlug: string;
  assignmentId?: string | null;
  mode: LabReportMode;
  aim: string;
  researchQuestion: string;
  hypothesis: string;
  procedureSteps: LabProcedureStep[];
  observations: string;
  results: string;
  conclusion: string;
  status?: LabReportStatus;
};

export type NotebookSectionKey =
  | "aim_hypothesis"
  | "procedure"
  | "observations"
  | "conclusion";

export interface TeacherLabNotebook {
  id: string;
  teacherId: string;
  teacherName?: string;
  experimentSlug: string;
  mode: LabReportMode;
  aim: string;
  researchQuestion: string;
  hypothesis: string;
  procedureSteps: LabProcedureStep[];
  expectedObservations: string;
  actualObservations: string;
  measurements: string;
  explanatoryNotes: string;
  results: string;
  conclusion: string;
  teachingGuidance: string;
  status: "draft" | "published";
  shares?: TeacherNotebookShare[];
  createdAt: string;
  updatedAt: string;
}

export interface TeacherNotebookShare {
  id: string;
  notebookId: string;
  teacherId: string;
  teacherName: string;
  classroomId: string;
  classroomName: string;
  experimentSlug: string;
  sharedSections: NotebookSectionKey[];
  publishedSnapshot: {
    aim?: string;
    researchQuestion?: string;
    hypothesis?: string;
    procedureSteps?: LabProcedureStep[];
    expectedObservations?: string;
    actualObservations?: string;
    measurements?: string;
    explanatoryNotes?: string;
    results?: string;
    conclusion?: string;
    teachingGuidance?: string;
  };
  version: number;
  publishedAt: string;
  updatedAt: string;
}

export interface TeacherNotebookSaveInput {
  experimentSlug: string;
  mode?: LabReportMode;
  aim?: string;
  researchQuestion?: string;
  hypothesis?: string;
  procedureSteps?: LabProcedureStep[];
  expectedObservations?: string;
  actualObservations?: string;
  measurements?: string;
  explanatoryNotes?: string;
  results?: string;
  conclusion?: string;
  teachingGuidance?: string;
  status?: "draft" | "published";
}

export interface ShareWithClassInput {
  experimentSlug: string;
  classroomIds: string[];
  sharedSections: NotebookSectionKey[];
}

export interface NotebookDictionary {
  notebookTab: string;
  notebookTitle: string;
  notebookSubtitle: string;
  notStarted: string;
  draft: string;
  submitted: string;
  reviewed: string;
  modeLabel: string;
  videoObservation: string;
  videoObservationDesc: string;
  supervisedLab: string;
  supervisedLabDesc: string;
  safetyNoticeSupervised: string;
  savingStatus: {
    saved: string;
    saving: string;
    unsaved: string;
    offline: string;
  };
  actions: {
    saveDraft: string;
    submitReport: string;
    submitting: string;
    editReport: string;
    addStep: string;
    removeStep: string;
  };
  sections: {
    aimHypothesis: {
      title: string;
      aimLabel: string;
      aimPlaceholder: string;
      questionLabel: string;
      questionPlaceholder: string;
      hypothesisLabel: string;
      hypothesisPlaceholder: string;
    };
    procedure: {
      title: string;
      stepSourceLabel: string;
      observedVideo: string;
      performedLab: string;
      stepPlaceholder: string;
      emptySteps: string;
    };
    observations: {
      title: string;
      placeholder: string;
      helperTitle: string;
      helperTips: string[];
    };
    results: {
      title: string;
      placeholder: string;
      helperText: string;
    };
    conclusion: {
      title: string;
      placeholder: string;
      guidingQuestions: string[];
    };
    feedback: {
      title: string;
      reviewedBy: string;
    };
  };
  guestNotice: {
    title: string;
    description: string;
    signInBtn: string;
    signUpBtn: string;
  };
}
