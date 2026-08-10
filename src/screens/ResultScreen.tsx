import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import AnalysisOptionRow from '../components/AnalysisOptionRow';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import { useTestStore } from '../store/testStore';
import { QuestionResult } from '../types';

export default function ResultScreen({ navigation }: any) {
  const phase = useTestStore((s) => s.phase);
  const result = useTestStore((s) => s.result);
  const resetTest = useTestStore((s) => s.resetTest);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((cur) => (cur === id ? null : id));
  }, []);

  if (phase !== 'submitted' || !result) {
    return (
      <ScreenContainer>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No result available</Text>
          <Button label="Back to start" onPress={() => navigation.replace('StartTest')} />
        </View>
      </ScreenContainer>
    );
  }

  function handleRetake() {
    resetTest();
    navigation.replace('StartTest');
  }

  const accuracyPct = Math.round((result.correctCount / result.totalQuestions) * 100);

  const renderItem = useCallback(
    ({ item }: { item: QuestionResult }) => (
      <ResultCard item={item} expanded={expandedId === item.question.id} onToggle={toggleExpand} />
    ),
    [expandedId, toggleExpand]
  );

  return (
    <ScreenContainer noPadding>
      <View style={styles.headerPad}>
        <Text style={styles.title}>Test Analysis & Results</Text>
        <Text style={styles.subtitle}>Detailed breakdown of your performance</Text>
      </View>

      {/* Hero Score Card with SVG Donut Chart */}
      <View style={styles.summaryCard}>
        <View style={styles.cardTopRow}>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>OVERALL SCORE</Text>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreValue}>{result.score}</Text>
              <Text style={styles.scoreOutOf}>/ {result.totalQuestions}</Text>
            </View>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyText}>{accuracyPct}% Accuracy</Text>
            </View>
          </View>

          {/* SVG Donut Chart */}
          <DonutChart
            total={result.totalQuestions}
            correct={result.correctCount}
            wrong={result.wrongCount}
            unattempted={result.unattemptedCount}
          />
        </View>

        <View style={styles.statsRow}>
          <StatChip label="Correct" value={result.correctCount} tone="correct" />
          <StatChip label="Wrong" value={result.wrongCount} tone="wrong" />
          <StatChip label="Unattempted" value={result.unattemptedCount} tone="neutral" />
        </View>
      </View>

      <View style={styles.listHeaderPad}>
        <Text style={styles.listHeader}>Question-by-Question Breakdown</Text>
        <Text style={styles.listSubHeader}>Tap any question card to inspect option states</Text>
      </View>

      <FlatList
        data={result.perQuestion}
        keyExtractor={(item) => item.question.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={9}
        removeClippedSubviews
      />

      <View style={styles.footer}>
        <Button label="Retake Test" onPress={handleRetake} />
      </View>
    </ScreenContainer>
  );
}

/** SVG Donut Chart for Outcome Breakdown */
function DonutChart({
  total,
  correct,
  wrong,
  unattempted,
}: {
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
}) {
  const size = 100;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const correctStroke = (correct / total) * circumference;
  const wrongStroke = (wrong / total) * circumference;
  const unattemptedStroke = (unattempted / total) * circumference;

  let offset = 0;
  const correctDash = `${correctStroke} ${circumference - correctStroke}`;
  const correctOffset = -offset;
  offset += correctStroke;

  const wrongDash = `${wrongStroke} ${circumference - wrongStroke}`;
  const wrongOffset = -offset;
  offset += wrongStroke;

  const unattemptedDash = `${unattemptedStroke} ${circumference - unattemptedStroke}`;
  const unattemptedOffset = -offset;

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Unattempted Segment */}
          {unattempted > 0 && (
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.neutral}
              strokeWidth={strokeWidth}
              strokeDasharray={unattemptedDash}
              strokeDashoffset={unattemptedOffset}
              fill="transparent"
              strokeLinecap="round"
            />
          )}
          {/* Wrong Segment */}
          {wrong > 0 && (
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.wrong}
              strokeWidth={strokeWidth}
              strokeDasharray={wrongDash}
              strokeDashoffset={wrongOffset}
              fill="transparent"
              strokeLinecap="round"
            />
          )}
          {/* Correct Segment */}
          {correct > 0 && (
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.correct}
              strokeWidth={strokeWidth}
              strokeDasharray={correctDash}
              strokeDashoffset={correctOffset}
              fill="transparent"
              strokeLinecap="round"
            />
          )}
        </G>
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutText}>{Math.round((correct / total) * 100)}%</Text>
      </View>
    </View>
  );
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: 'correct' | 'wrong' | 'neutral' }) {
  const map = {
    correct: { bg: colors.correctBg, fg: colors.correct },
    wrong: { bg: colors.wrongBg, fg: colors.wrong },
    neutral: { bg: colors.neutralBg, fg: colors.textSecondary },
  } as const;
  const t = map[tone];
  return (
    <View style={[styles.statChip, { backgroundColor: t.bg }]}>
      <Text style={[styles.statValue, { color: t.fg }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

function ResultCard({
  item,
  expanded,
  onToggle,
}: {
  item: QuestionResult;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const outcomeTone = item.outcome === 'correct' ? 'correct' : item.outcome === 'wrong' ? 'wrong' : 'neutral';
  const outcomeLabel =
    item.outcome === 'correct' ? 'Correct' : item.outcome === 'wrong' ? 'Wrong' : 'Not answered';

  const selectedText = item.selected.length
    ? item.selected.map((i) => item.question.options[i]).join(', ')
    : 'Not answered';
  const correctText = item.question.correctAnswerIndices
    .map((i) => item.question.options[i])
    .join(', ');

  return (
    <Pressable style={styles.card} onPress={() => onToggle(item.question.id)}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardQNum}>Q{Number(item.question.id.split('-')[1])}</Text>
        <Badge label={item.question.type} tone="blue" />
        <Badge label={outcomeLabel} tone={outcomeTone} style={{ marginLeft: 'auto' }} />
      </View>
      <Text style={styles.cardQText} numberOfLines={expanded ? undefined : 2}>
        {item.question.text}
      </Text>

      {!expanded && (
        <View style={styles.quickRow}>
          <Text style={styles.quickLabel}>Your answer: </Text>
          <Text style={styles.quickValue} numberOfLines={1}>
            {selectedText}
          </Text>
        </View>
      )}

      {expanded && (
        <View style={styles.expandedWrap}>
          {item.question.options.map((opt, idx) => (
            <AnalysisOptionRow
              key={idx}
              text={opt}
              index={idx}
              state={item.optionStates[idx]}
            />
          ))}
          <Text style={styles.correctSummary}>Correct answer: {correctText}</Text>
        </View>
      )}

      <Text style={styles.expandHint}>{expanded ? 'Tap to collapse ▲' : 'Tap to expand ▼'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerPad: { paddingHorizontal: 20, paddingTop: spacing.md },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: spacing.md,
    backgroundColor: colors.ink,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  scoreInfo: { flex: 1 },
  scoreLabel: { fontSize: 11, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },
  scoreBlock: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4 },
  scoreValue: { fontSize: 38, fontWeight: '800', color: colors.white, letterSpacing: -1 },
  scoreOutOf: { fontSize: 16, color: colors.textMuted, marginLeft: 4, marginBottom: 6, fontWeight: '600' },
  accuracyBadge: {
    backgroundColor: 'rgba(37,99,235,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.4)',
  },
  accuracyText: { color: colors.white, fontSize: 11, fontWeight: '700' },

  donutWrap: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  donutCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  donutText: { fontSize: 16, fontWeight: '800', color: colors.white },

  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statChip: { flex: 1, borderRadius: radius.lg, paddingVertical: 10, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  listHeaderPad: { paddingHorizontal: 20, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  listHeader: { ...typography.h2, color: colors.textPrimary },
  listSubHeader: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  listContent: { paddingHorizontal: 20, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  cardQNum: { fontSize: 13, fontWeight: '800', color: colors.blue },
  cardQText: { ...typography.bodyStrong, color: colors.textPrimary, marginBottom: spacing.sm, fontSize: 15, lineHeight: 22 },
  quickRow: { flexDirection: 'row' },
  quickLabel: { ...typography.caption, color: colors.textMuted },
  quickValue: { ...typography.caption, color: colors.textSecondary, flexShrink: 1, fontWeight: '600' },
  expandedWrap: { marginTop: spacing.xs },
  correctSummary: { ...typography.caption, color: colors.correct, marginTop: spacing.xs, fontWeight: '700' },
  expandHint: { ...typography.caption, color: colors.blue, marginTop: spacing.sm, textAlign: 'right', fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingBottom: spacing.lg, paddingTop: spacing.sm },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  emptyTitle: { ...typography.h2, color: colors.textPrimary },
});
