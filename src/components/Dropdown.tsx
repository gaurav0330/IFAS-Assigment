import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

interface Props {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
}

export default function Dropdown({ label, value, options, onChange, placeholder = 'Select', error }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.trigger, error && styles.triggerError]}
        accessibilityRole="button"
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.option, item === value && styles.optionSelected]}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, item === value && styles.optionTextSelected]}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { ...typography.caption, color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  triggerError: { borderColor: colors.wrong, backgroundColor: colors.wrongBg },
  valueText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  placeholderText: { fontSize: 15, color: colors.textMuted },
  chevron: { color: colors.blue, fontSize: 16, fontWeight: '700' },
  error: { color: colors.wrong, fontSize: 12, marginTop: 4, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    maxHeight: '60%',
  },
  sheetTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },
  option: { paddingVertical: 14, borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: 4 },
  optionSelected: { backgroundColor: colors.blueTint },
  optionText: { fontSize: 15, color: colors.textPrimary },
  optionTextSelected: { color: colors.blue, fontWeight: '700' },
});
