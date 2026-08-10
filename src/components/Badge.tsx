import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

interface Props {
  label: string;
  tone?: 'blue' | 'ink' | 'warn' | 'correct' | 'wrong' | 'neutral';
  style?: ViewStyle;
}

export default function Badge({ label, tone = 'blue', style }: Props) {
  const toneStyles: Record<string, { bg: string; fg: string }> = {
    blue: { bg: colors.blueTint, fg: colors.blueDeep },
    ink: { bg: colors.ink, fg: colors.white },
    warn: { bg: colors.warnBg, fg: colors.warn },
    correct: { bg: colors.correctBg, fg: colors.correct },
    wrong: { bg: colors.wrongBg, fg: colors.wrong },
    neutral: { bg: colors.neutralBg, fg: colors.textSecondary },
  };
  const t = toneStyles[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { ...typography.caption, fontWeight: '700' },
});
