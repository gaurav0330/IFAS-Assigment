import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import OptionRow from '../components/OptionRow';
import QuestionPalette from '../components/QuestionPalette';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import { useTestStore } from '../store/testStore';
import { useCountdown } from '../utils/useCountdown';
import { formatRemaining } from '../utils/timer';

export default function TestScreen({ navigation }: any) {
  const phase = useTestStore((s) => s.phase);
  const currentQuestionIndex = useTestStore((s) => s.currentQuestionIndex);
  const answers = useTestStore((s) => s.answers);
  const endTimestamp = useTestStore((s) => s.endTimestamp);
  const activeQuestions = useTestStore((s) => s.activeQuestions);
  const goToQuestion = useTestStore((s) => s.goToQuestion);
  const next = useTestStore((s) => s.next);
  const back = useTestStore((s) => s.back);
  const setMcqAnswer = useTestStore((s) => s.setMcqAnswer);
  const toggleMsqAnswer = useTestStore((s) => s.toggleMsqAnswer);
  const submitTest = useTestStore((s) => s.submitTest);
  const autoSubmitIfExpired = useTestStore((s) => s.autoSubmitIfExpired);
  const activeTestMeta = useTestStore((s) => s.activeTestMeta);
  const allowEarlySubmit = activeTestMeta.allowEarlySubmit;

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleExpire = useCallback(() => {
    autoSubmitIfExpired();
  }, [autoSubmitIfExpired]);

  const remainingMs = useCountdown(endTimestamp, handleExpire);

  useEffect(() => {
    if (phase === 'submitted') {
      navigation.replace('Result');
    }
  }, [phase, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (useTestStore.getState().phase === 'in-progress') {
        useTestStore.getState().triggerLeaveWarning();
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Guard: if there's no active session (e.g. deep nav), send back to start.
  if (phase !== 'in-progress') {
    return (
      <ScreenContainer>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No active test session</Text>
          <Button label="Back to start" onPress={() => navigation.replace('StartTest')} />
        </View>
      </ScreenContainer>
    );
  }

  const question = activeQuestions[currentQuestionIndex];
  const selected = answers[question.id]?.selected ?? [];
  const total = activeQuestions.length;
  const isLow = remainingMs < 60_000;

  function handleOptionPress(optionIndex: number) {
    if (question.type === 'MCQ') {
      setMcqAnswer(question.id, optionIndex);
    } else {
      toggleMsqAnswer(question.id, optionIndex);
    }
  }

  function handleConfirmSubmit() {
    setConfirmOpen(false);
    submitTest();
  }

  const progressPercent = Math.round(((currentQuestionIndex + 1) / total) * 100);

  return (
    <ScreenContainer>
      {/* Header: progress bar + timer */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: spacing.md }}>
          <View style={styles.counterRow}>
            <Text style={styles.questionCounter}>
              Question <Text style={styles.questionNumCurrent}>{currentQuestionIndex + 1}</Text> of {total}
            </Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Badge
            label={question.type === 'MCQ' ? 'Single Choice (MCQ)' : 'Multiple Choice (MSQ)'}
            tone="blue"
            style={{ marginTop: 8 }}
          />
        </View>

        <View style={[styles.timerBox, isLow && styles.timerBoxLow]}>
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={styles.timerText}>
            {formatRemaining(remainingMs)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Question Card Box */}
        <View style={styles.questionCard}>
          <View style={styles.questionCardHeader}>
            <Text style={styles.questionTagText}>QUESTION {currentQuestionIndex + 1}</Text>
          </View>
          <Text style={styles.questionText}>{question.text}</Text>

          <View style={styles.optionsWrap}>
            {question.options.map((opt, idx) => (
              <OptionRow
                key={idx}
                text={opt}
                index={idx}
                type={question.type}
                selected={selected.includes(idx)}
                onPress={() => handleOptionPress(idx)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer controls */}
      <View style={styles.footer}>
        <View style={styles.navRow}>
          <Button
            label="Back"
            variant="secondary"
            onPress={back}
            disabled={currentQuestionIndex === 0}
            style={styles.navButton}
          />
          <Pressable
            style={({ pressed }) => [styles.paletteButton, pressed && { opacity: 0.8 }]}
            onPress={() => setPaletteOpen(true)}
          >
            <Ionicons name="grid-outline" size={16} color={colors.blueDeep} />
            <Text style={styles.paletteButtonText}>Grid</Text>
          </Pressable>
          <Button
            label="Next"
            onPress={next}
            disabled={currentQuestionIndex === total - 1}
            style={styles.navButton}
          />
        </View>
        <Button
          label="Submit Test"
          variant="danger"
          onPress={() => setConfirmOpen(true)}
          style={{ marginTop: spacing.sm }}
        />
      </View>

      {/* Palette drawer */}
      <Modal visible={paletteOpen} animationType="slide" transparent onRequestClose={() => setPaletteOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setPaletteOpen(false)}>
          <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
            <View style={styles.drawerHandle} />
            <Text style={styles.drawerTitle}>Jump to question</Text>
            <QuestionPalette
              questions={activeQuestions}
              answers={answers}
              currentIndex={currentQuestionIndex}
              onJump={(idx) => {
                goToQuestion(idx);
                setPaletteOpen(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Submit confirmation */}
      <Modal visible={confirmOpen} transparent animationType="fade" onRequestClose={() => setConfirmOpen(false)}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Submit test?</Text>
            <Text style={styles.confirmBody}>
              {answeredCountLabel(answers, total)} answered. You won't be able to change your
              answers after submitting.
            </Text>
            <Button label="Submit now" variant="danger" onPress={handleConfirmSubmit} />
            <Button
              label="Keep reviewing"
              variant="ghost"
              onPress={() => setConfirmOpen(false)}
              style={{ marginTop: spacing.xs }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function answeredCountLabel(answers: ReturnType<typeof useTestStore.getState>['answers'], total: number) {
  const answered = Object.values(answers).filter((a) => a.selected.length > 0).length;
  return `${answered} of ${total} questions`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  questionCounter: { ...typography.caption, color: colors.textSecondary },
  questionNumCurrent: { color: colors.blue, fontWeight: '800' },
  progressPercentText: { fontSize: 11, fontWeight: '700', color: colors.blue },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 3,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    gap: 6,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timerBoxLow: { backgroundColor: colors.wrong, shadowColor: colors.wrong },
  timerIcon: { fontSize: 13, color: colors.white },
  timerText: { ...typography.mono, color: colors.white, fontSize: 14 },
  body: { flex: 1 },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  questionCardHeader: {
    backgroundColor: colors.blueTint,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  questionTagText: { fontSize: 11, fontWeight: '800', color: colors.blue, letterSpacing: 0.5 },
  questionText: { ...typography.h1, color: colors.textPrimary, marginBottom: spacing.lg, lineHeight: 28, fontSize: 18 },
  optionsWrap: { paddingBottom: spacing.sm },
  footer: { paddingTop: spacing.sm, paddingBottom: spacing.sm },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  navButton: { flex: 1 },
  paletteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.blueTint,
    justifyContent: 'center',
  },
  paletteButtonText: { fontSize: 13.5, fontWeight: '700', color: colors.blueDeep },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  confirmOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center' },
  drawer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    height: '65%',
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  drawerTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  confirmCard: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.raised,
  },
  confirmTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 6 },
  confirmBody: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  emptyTitle: { ...typography.h2, color: colors.textPrimary },
  timedHint: {
    marginTop: spacing.sm,
    backgroundColor: colors.blueTint,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  timedHintText: {
    ...typography.caption,
    color: colors.blueDeep,
    textAlign: 'center',
    fontWeight: '500',
  },
});
