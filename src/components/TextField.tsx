import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
  rightElement?: React.ReactNode;
}

export default function TextField({ label, error, rightElement, style, ...rest }: Props) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused, !!error && styles.inputRowError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {rightElement}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  labelFocused: { color: colors.blue },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  inputRowFocused: { borderColor: colors.blue, backgroundColor: colors.surface },
  inputRowError: { borderColor: colors.wrong, backgroundColor: colors.wrongBg },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: colors.textPrimary },
  error: { color: colors.wrong, fontSize: 12, marginTop: 4, fontWeight: '600' },
});
