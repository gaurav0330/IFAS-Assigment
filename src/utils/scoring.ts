import {
  AnswersMap,
  PerOptionState,
  Question,
  QuestionOutcome,
  QuestionResult,
  TestResultSummary,
} from '../types';

/**
 * Scoring rule (deliberate, see README):
 * - 1 mark per question, no negative marking.
 * - MCQ: correct if the single selected index matches the single correct index.
 * - MSQ: correct ONLY if the selected set is an EXACT match of the correct set.
 *   Selecting a subset of correct options (partial credit) is WRONG.
 *   Selecting any wrong option, even alongside all correct ones, is WRONG.
 * - No selection at all = unattempted (not counted as wrong).
 */

function arraysEqualAsSets(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size !== sb.size) return false;
  for (const v of sa) if (!sb.has(v)) return false;
  return true;
}

export function getOutcomeForQuestion(question: Question, selected: number[]): QuestionOutcome {
  if (!selected || selected.length === 0) return 'unattempted';
  const isCorrect = arraysEqualAsSets(selected, question.correctAnswerIndices);
  return isCorrect ? 'correct' : 'wrong';
}

export function getOptionStates(question: Question, selected: number[]): PerOptionState[] {
  const outcome = getOutcomeForQuestion(question, selected);
  const correctSet = new Set(question.correctAnswerIndices);
  const selectedSet = new Set(selected);

  return question.options.map((_, idx) => {
    const isCorrectOption = correctSet.has(idx);
    const isSelected = selectedSet.has(idx);

    if (outcome === 'unattempted') {
      return isCorrectOption ? 'correct-irrelevant' : 'neutral';
    }

    if (isSelected && isCorrectOption) return 'selected-correct';
    if (isSelected && !isCorrectOption) return 'selected-wrong';
    if (!isSelected && isCorrectOption) return 'correct-missed';
    return 'neutral';
  });
}

export function scoreTest(questions: Question[], answers: AnswersMap): TestResultSummary {
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const perQuestion: QuestionResult[] = questions.map((q) => {
    const selected = answers[q.id]?.selected ?? [];
    const outcome = getOutcomeForQuestion(q, selected);
    if (outcome === 'correct') correctCount += 1;
    else if (outcome === 'wrong') wrongCount += 1;
    else unattemptedCount += 1;

    return {
      question: q,
      selected,
      outcome,
      optionStates: getOptionStates(q, selected),
    };
  });

  return {
    totalQuestions: questions.length,
    correctCount,
    wrongCount,
    unattemptedCount,
    score: correctCount, // 1 mark per correct question, no negative marking
    perQuestion,
  };
}
