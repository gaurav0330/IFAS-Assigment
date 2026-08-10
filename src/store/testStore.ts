import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnswersMap, TestPhase, TestResultSummary, Question, TestMeta } from '../types';
import { generateTestQuestions, TEST_CONFIGS } from '../data/mockQuestions';
import { computeEndTimestamp } from '../utils/timer';
import { scoreTest } from '../utils/scoring';

interface TestStoreState {
  phase: TestPhase;
  currentQuestionIndex: number;
  answers: AnswersMap;
  endTimestamp: number | null;
  durationMinutes: number;
  result: TestResultSummary | null;
  startedAt: number | null;
  showLeaveWarning: boolean;
  activeQuestions: Question[];
  activeTestMeta: TestMeta;

  // actions
  setupNewTest: (meta: TestMeta, questions: Question[]) => void;
  beginInstructions: () => void;
  startTest: () => void;
  goToQuestion: (index: number) => void;
  next: () => void;
  back: () => void;
  setMcqAnswer: (questionId: string, optionIndex: number) => void;
  toggleMsqAnswer: (questionId: string, optionIndex: number) => void;
  submitTest: () => void;
  autoSubmitIfExpired: () => boolean;
  resetTest: () => void;
  triggerLeaveWarning: () => void;
  hideLeaveWarning: () => void;
}

const DEFAULT_META = TEST_CONFIGS.quick;
const DEFAULT_QUESTIONS = generateTestQuestions(DEFAULT_META.totalQuestions);

const initialState = {
  phase: 'idle' as TestPhase,
  currentQuestionIndex: 0,
  answers: {} as AnswersMap,
  endTimestamp: null as number | null,
  durationMinutes: DEFAULT_META.durationMinutes,
  result: null as TestResultSummary | null,
  startedAt: null as number | null,
  showLeaveWarning: false,
  activeQuestions: DEFAULT_QUESTIONS,
  activeTestMeta: DEFAULT_META,
};

export const useTestStore = create<TestStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setupNewTest: (meta: TestMeta, questions: Question[]) => set({
        phase: 'idle',
        currentQuestionIndex: 0,
        answers: {},
        result: null,
        endTimestamp: null,
        startedAt: null,
        showLeaveWarning: false,
        activeTestMeta: meta,
        activeQuestions: questions,
        durationMinutes: meta.durationMinutes,
      }),

      beginInstructions: () => set({ phase: 'instructions' }),

      startTest: () => {
        const now = Date.now();
        const { durationMinutes } = get();
        set({
          phase: 'in-progress',
          currentQuestionIndex: 0,
          answers: {},
          endTimestamp: computeEndTimestamp(durationMinutes, now),
          startedAt: now,
          result: null,
        });
      },

      goToQuestion: (index: number) => {
        const total = get().activeQuestions.length;
        if (get().phase !== 'in-progress') return;
        const clamped = Math.max(0, Math.min(total - 1, index));
        set({ currentQuestionIndex: clamped });
      },

      next: () => {
        const total = get().activeQuestions.length;
        const idx = get().currentQuestionIndex;
        const allowEarlySubmit = get().activeTestMeta.allowEarlySubmit;
        if (idx < total - 1) {
          set({ currentQuestionIndex: idx + 1 });
        } else if (!allowEarlySubmit) {
          // Full-length test: wrap back to first question for review
          set({ currentQuestionIndex: 0 });
        }
      },

      back: () => {
        const idx = get().currentQuestionIndex;
        if (idx > 0) set({ currentQuestionIndex: idx - 1 });
      },

      setMcqAnswer: (questionId: string, optionIndex: number) => {
        if (get().phase !== 'in-progress') return;
        set((state) => {
          const current = state.answers[questionId]?.selected ?? [];
          const isSameSelected = current.length === 1 && current[0] === optionIndex;
          return {
            answers: {
              ...state.answers,
              [questionId]: { selected: isSameSelected ? [] : [optionIndex] },
            },
          };
        });
      },

      toggleMsqAnswer: (questionId: string, optionIndex: number) => {
        if (get().phase !== 'in-progress') return;
        set((state) => {
          const current = state.answers[questionId]?.selected ?? [];
          const exists = current.includes(optionIndex);
          const nextSelected = exists
            ? current.filter((i) => i !== optionIndex)
            : [...current, optionIndex];
          return {
            answers: {
              ...state.answers,
              [questionId]: { selected: nextSelected },
            },
          };
        });
      },

      submitTest: () => {
        if (get().phase !== 'in-progress') return;
        const { activeQuestions, answers } = get();
        const result = scoreTest(activeQuestions, answers);
        set({ phase: 'submitted', result });
      },

      autoSubmitIfExpired: () => {
        const state = get();
        if (state.phase !== 'in-progress' || !state.endTimestamp) return false;
        if (Date.now() >= state.endTimestamp) {
          const result = scoreTest(state.activeQuestions, state.answers);
          set({ phase: 'submitted', result });
          return true;
        }
        return false;
      },

      resetTest: () => set({ ...initialState }),
      triggerLeaveWarning: () => set({ showLeaveWarning: true }),
      hideLeaveWarning: () => set({ showLeaveWarning: false }),
    }),
    {
      name: 'ifas-test-session-v3',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        phase: state.phase,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        endTimestamp: state.endTimestamp,
        durationMinutes: state.durationMinutes,
        result: state.result,
        startedAt: state.startedAt,
        activeQuestions: state.activeQuestions,
        activeTestMeta: state.activeTestMeta,
      }),
      // Safely merge persisted data with the initial state.
      // This prevents crashes when persisted data is missing new fields
      // that were added after the user's last session (e.g. activeTestMeta).
      merge: (persistedState: any, currentState: TestStoreState): TestStoreState => ({
        ...currentState,
        ...persistedState,
        activeTestMeta: persistedState?.activeTestMeta ?? currentState.activeTestMeta,
        activeQuestions:
          Array.isArray(persistedState?.activeQuestions) && persistedState.activeQuestions.length > 0
            ? persistedState.activeQuestions
            : currentState.activeQuestions,
      }),
    }
  )
);
