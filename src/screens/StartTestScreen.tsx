import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import { useTestStore } from '../store/testStore';
import { useUserStore } from '../store/userStore';

export default function StartTestScreen({ navigation }: any) {
  const beginInstructions = useTestStore((s) => s.beginInstructions);
  const phase = useTestStore((s) => s.phase);
  const TEST_META = useTestStore((s) => s.activeTestMeta);
  const profile = useUserStore((s) => s.profile);

  const targetExam = profile?.exam || 'NEET UG';
  const rawExamName = TEST_META.examName;
  const displayExamName = rawExamName.includes(targetExam)
    ? rawExamName
    : rawExamName.replace(/^(NEET UG|JEE Main|CUET UG|CAT|GATE \(CS\))/, targetExam);

  function handleStart() {
    if (!profile) {
      Alert.alert('Profile Required', 'Please complete your profile details before starting a test.', [
        { text: 'Complete Profile', onPress: () => navigation.navigate('ProfileTab') },
      ]);
      return;
    }
    beginInstructions();
    navigation.navigate('Instructions');
  }

  function handleResume() {
    navigation.navigate(phase === 'submitted' ? 'Result' : 'Test');
  }

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <Logo size="md" />
      </View>

      <View style={styles.center}>
        <Text style={styles.examName}>{displayExamName}</Text>
        <Text style={styles.meta}>
          {TEST_META.totalQuestions} Questions · {TEST_META.durationMinutes} minutes
        </Text>

        <View style={styles.card}>
          <InfoRow label="Question types" value="MCQ (single) & MSQ (multiple)" />
          <InfoRow label="Marking" value="+1 per correct · no negative marking" />
          <InfoRow label="Navigation" value="Move freely between questions" />
        </View>
      </View>

      <View style={styles.bottom}>
        {(phase === 'in-progress' || phase === 'submitted') && (
          <Button
            label={phase === 'submitted' ? 'View your result' : 'Resume test'}
            onPress={handleResume}
            style={{ marginBottom: spacing.md }}
          />
        )}
        <Button
          label={phase === 'in-progress' || phase === 'submitted' ? 'Start a new test' : 'Start Test'}
          variant={phase === 'in-progress' || phase === 'submitted' ? 'secondary' : 'primary'}
          onPress={handleStart}
        />
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.md, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center' },
  iconBlock: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.blueTint,
    borderWidth: 1,
    borderColor: colors.blueTintStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconGlyph: { fontSize: 30 },
  examName: { ...typography.display, color: colors.textPrimary },
  meta: { ...typography.bodyStrong, color: colors.blue, marginTop: 6, marginBottom: spacing.xl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: { color: colors.textSecondary, fontSize: 13 },
  infoValue: { color: colors.textPrimary, fontSize: 13, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  bottom: { paddingBottom: spacing.lg },
});
