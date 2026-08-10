import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import { colors, radius, spacing, typography } from '../theme/theme';
import { useTestStore } from '../store/testStore';

import Logo from '../components/Logo';

const RULES = [
  'Each question carries 1 mark.',
  'MSQ questions require all correct options to be selected for the mark — no partial credit.',
  'No negative marking for incorrect answers.',
  'You can navigate between questions freely, in any order.',
  'The test auto-submits when the timer reaches zero.',
  'Once submitted, answers cannot be changed.',
];

export default function InstructionsScreen({ navigation }: any) {
  const [checked, setChecked] = useState(false);
  const startTest = useTestStore((s) => s.startTest);

  function handleProceed() {
    startTest();
    navigation.replace('Test');
  }

  return (
    <ScreenContainer>
      <View style={{ alignItems: 'center', paddingTop: spacing.xs, marginBottom: spacing.sm }}>
        <Logo size="md" />
      </View>
      <Text style={styles.title}>Before you begin</Text>
      <Text style={styles.subtitle}>Please read the rules carefully.</Text>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <View style={styles.rulesCard}>
          {RULES.map((rule, idx) => (
            <View key={idx} style={styles.ruleRow}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>{idx + 1}</Text>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.checkboxRow} onPress={() => setChecked((c) => !c)}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>I have read and understood the instructions</Text>
      </Pressable>

      <Button label="Proceed to Test" onPress={handleProceed} disabled={!checked} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.display, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg },
  list: { flex: 1 },
  rulesCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  ruleRow: { flexDirection: 'row', marginBottom: spacing.lg, alignItems: 'flex-start' },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  bulletText: { fontSize: 11, fontWeight: '800', color: colors.blue },
  ruleText: { ...typography.body, color: colors.textPrimary, flex: 1, lineHeight: 22 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: { backgroundColor: colors.blue, borderColor: colors.blue },
  checkmark: { color: colors.white, fontWeight: '800', fontSize: 13 },
  checkboxLabel: { ...typography.bodyStrong, color: colors.textPrimary, fontSize: 14, flex: 1 },
});
