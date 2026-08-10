import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { PerOptionState } from '../types';

interface Props {
  text: string;
  index: number;
  state: PerOptionState;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function stateStyles(state: PerOptionState) {
  switch (state) {
    case 'selected-correct':
      return { bg: colors.correctBg, border: colors.correctBorder, fg: colors.correct, tag: 'Your answer · Correct' };
    case 'selected-wrong':
      return { bg: colors.wrongBg, border: colors.wrongBorder, fg: colors.wrong, tag: 'Your answer · Incorrect' };
    case 'correct-missed':
      return { bg: colors.correctBg, border: colors.correctBorder, fg: colors.correct, tag: 'Correct answer' };
    case 'correct-irrelevant':
      return { bg: colors.neutralBg, border: colors.neutralBorder, fg: colors.textSecondary, tag: 'Correct answer' };
    default:
      return { bg: colors.white, border: colors.border, fg: colors.textSecondary, tag: null };
  }
}

export default function AnalysisOptionRow({ text, index, state }: Props) {
  const s = stateStyles(state);
  return (
    <View style={[styles.row, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[styles.letter, { color: s.fg }]}>{LETTERS[index]}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.optionText}>{text}</Text>
        {s.tag && <Text style={[styles.tag, { color: s.fg }]}>{s.tag}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  letter: { ...typography.bodyStrong, marginRight: spacing.sm, width: 16 },
  optionText: { ...typography.body, color: colors.textPrimary },
  tag: { ...typography.caption, fontWeight: '700', marginTop: 2 },
});
