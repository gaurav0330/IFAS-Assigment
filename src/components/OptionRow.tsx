import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

interface Props {
  text: string;
  index: number;
  selected: boolean;
  type: 'MCQ' | 'MSQ';
  onPress: () => void;
  disabled?: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function OptionRow({ text, index, selected, type, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        disabled && styles.rowDisabled,
        pressed && !disabled && styles.rowPressed,
      ]}
      accessibilityRole={type === 'MCQ' ? 'radio' : 'checkbox'}
      accessibilityState={{ selected, checked: selected }}
    >
      <View style={[styles.letterBadge, selected && styles.letterBadgeSelected]}>
        <Text style={[styles.letterText, selected && styles.letterTextSelected]}>
          {LETTERS[index]}
        </Text>
      </View>

      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{text}</Text>

      {type === 'MCQ' ? (
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      ) : (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  rowSelected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueTint,
    shadowColor: colors.blue,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  rowPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  rowDisabled: { opacity: 0.7 },
  letterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  letterBadgeSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  letterText: { ...typography.caption, color: colors.textSecondary, fontWeight: '700' },
  letterTextSelected: { color: colors.white },
  optionText: { ...typography.body, color: colors.textPrimary, flex: 1, paddingRight: spacing.xs },
  optionTextSelected: { color: colors.blueDeep, fontWeight: '600' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  radioSelected: { borderColor: colors.blue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.blue },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  checkboxSelected: { backgroundColor: colors.blue, borderColor: colors.blue },
  checkmark: { color: colors.white, fontWeight: '800', fontSize: 13 },
});
