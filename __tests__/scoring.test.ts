import { getOptionStates, getOutcomeForQuestion, scoreTest } from '../src/utils/scoring';
import { computeEndTimestamp, getRemainingMs, isExpired } from '../src/utils/timer';
import { Question } from '../src/types';

const mcq: Question = {
  id: 'q1',
  type: 'MCQ',
  text: 'Sample MCQ',
  options: ['A', 'B', 'C', 'D'],
  correctAnswerIndices: [1],
};

const msq: Question = {
  id: 'q2',
  type: 'MSQ',
  text: 'Sample MSQ',
  options: ['A', 'B', 'C', 'D'],
  correctAnswerIndices: [0, 2],
};

describe('MCQ scoring', () => {
  it('marks correct when the single selected index matches', () => {
    expect(getOutcomeForQuestion(mcq, [1])).toBe('correct');
  });

  it('marks wrong when a different index is selected', () => {
    expect(getOutcomeForQuestion(mcq, [0])).toBe('wrong');
  });

  it('marks unattempted when nothing is selected', () => {
    expect(getOutcomeForQuestion(mcq, [])).toBe('unattempted');
  });
});

describe('MSQ exact-match scoring', () => {
  it('marks correct only on an exact set match', () => {
    expect(getOutcomeForQuestion(msq, [0, 2])).toBe('correct');
  });

  it('gives NO partial credit for a subset of correct options', () => {
    expect(getOutcomeForQuestion(msq, [0])).toBe('wrong');
  });

  it('marks wrong if a correct option is selected alongside a wrong one', () => {
    expect(getOutcomeForQuestion(msq, [0, 1, 2])).toBe('wrong');
  });

  it('is order-independent when comparing sets', () => {
    expect(getOutcomeForQuestion(msq, [2, 0])).toBe('correct');
  });

  it('marks unattempted when nothing is selected', () => {
    expect(getOutcomeForQuestion(msq, [])).toBe('unattempted');
  });
});

describe('per-option state derivation', () => {
  it('flags selected-and-wrong plus correct-missed together for a partial MSQ answer', () => {
    // user selected option 1 (wrong) only; correct = [0, 2]
    const states = getOptionStates(msq, [1]);
    expect(states[0]).toBe('correct-missed'); // correct, not selected
    expect(states[1]).toBe('selected-wrong'); // selected, wrong
    expect(states[2]).toBe('correct-missed'); // correct, not selected
    expect(states[3]).toBe('neutral');
  });

  it('flags correct-irrelevant for unattempted questions instead of correct-missed', () => {
    const states = getOptionStates(msq, []);
    expect(states[0]).toBe('correct-irrelevant');
    expect(states[2]).toBe('correct-irrelevant');
    expect(states[1]).toBe('neutral');
  });
});

describe('scoreTest aggregate', () => {
  it('computes score as count of correct questions with no negative marking', () => {
    const answers = {
      q1: { selected: [1] }, // correct
      q2: { selected: [0] }, // wrong (partial MSQ)
    };
    const result = scoreTest([mcq, msq], answers);
    expect(result.correctCount).toBe(1);
    expect(result.wrongCount).toBe(1);
    expect(result.unattemptedCount).toBe(0);
    expect(result.score).toBe(1);
  });

  it('counts unanswered questions as unattempted, not wrong', () => {
    const result = scoreTest([mcq, msq], {});
    expect(result.unattemptedCount).toBe(2);
    expect(result.score).toBe(0);
  });
});

describe('timer: timestamp-based elapsed/remaining calculation', () => {
  it('computes remaining time purely from timestamps, unaffected by "missed ticks"', () => {
    const start = 1_000_000;
    const end = computeEndTimestamp(10, start); // 10 minutes
    // Simulate the app being backgrounded for a long stretch (no ticks fired at all),
    // then resumed 4 minutes later. Remaining should reflect real elapsed time.
    const resumedAt = start + 4 * 60 * 1000;
    const remaining = getRemainingMs(end, resumedAt);
    expect(remaining).toBe(6 * 60 * 1000);
  });

  it('reports expired once now passes the end timestamp, regardless of tick history', () => {
    const end = computeEndTimestamp(1, 0); // 1 minute from epoch 0
    expect(isExpired(end, 59_000)).toBe(false);
    expect(isExpired(end, 60_000)).toBe(true);
    expect(isExpired(end, 120_000)).toBe(true);
  });

  it('never returns negative remaining time', () => {
    const end = computeEndTimestamp(1, 0);
    expect(getRemainingMs(end, 999_999)).toBe(0);
  });
});
