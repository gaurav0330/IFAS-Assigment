// ---------- Question / Test domain types ----------

export type QuestionType = 'MCQ' | 'MSQ';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswerIndices: number[]; // length 1 for MCQ, 1+ for MSQ
}

export interface TestMeta {
  examName: string;
  totalQuestions: number;
  durationMinutes: number;
  /** When false, the Submit button is hidden; the test ends only when the timer expires. */
  allowEarlySubmit: boolean;
}

// A single answer for one question.
// MCQ -> at most one selected index
// MSQ -> a set (array, order-independent) of selected indices
export interface AnswerState {
  selected: number[]; // empty = not answered
}

// Map of questionId -> AnswerState
export type AnswersMap = Record<string, AnswerState>;

export type PerOptionState =
  | 'selected-correct'       // user selected it, and it is correct
  | 'selected-wrong'         // user selected it, and it is NOT correct
  | 'correct-missed'         // correct, user did not select it (and answer is wrong overall)
  | 'correct-irrelevant'     // correct, not selected, but irrelevant context (unattempted)
  | 'neutral';                // not correct, not selected

export type QuestionOutcome = 'correct' | 'wrong' | 'unattempted';

export interface QuestionResult {
  question: Question;
  selected: number[];
  outcome: QuestionOutcome;
  optionStates: PerOptionState[]; // aligned with question.options
}

export interface TestResultSummary {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  score: number; // 1 mark per correct question, no negative marking
  perQuestion: QuestionResult[];
}

// ---------- Persisted test session ----------

export type TestPhase = 'idle' | 'instructions' | 'in-progress' | 'submitted';

export interface TestSessionState {
  phase: TestPhase;
  currentQuestionIndex: number;
  answers: AnswersMap;
  endTimestamp: number | null; // Date.now() ms at which the test auto-submits
  durationMinutes: number;
  result: TestResultSummary | null;
  startedAt: number | null;
}

// ---------- Profile form ----------

export type Gender = 'Male' | 'Female';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  dob: string | null; // ISO date string
  gender: Gender | null;
  exam: string | null;
  qualification: string | null;
}
