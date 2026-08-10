import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import { useUserStore } from '../store/userStore';
import { useTestStore } from '../store/testStore';

export default function ProgressScreen({ navigation }: any) {
  const profile = useUserStore((s) => s.profile);
  const result = useTestStore((s) => s.result);
  const phase = useTestStore((s) => s.phase);

  const [activeFilter, setActiveFilter] = useState<'all' | 'recent'>('all');

  const studentName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : 'Student';
  const targetExam = profile?.exam || 'CSIR NET / GATE';
  const hasCompletedTest = phase === 'submitted' && result;

  const scorePct = hasCompletedTest ? Math.round((result.correctCount / result.totalQuestions) * 100) : 78;
  const testsTaken = hasCompletedTest ? 1 : 0;

  return (
    <ScreenContainer noPadding>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress & Analytics</Text>
          <Text style={styles.subtitle}>Track your score trends and exam readiness.</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={[colors.ink, colors.blueDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarPill}>
              <Text style={styles.avatarText}>{studentName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{studentName}</Text>
              <Text style={styles.profileExam}>Target: {targetExam}</Text>
            </View>
            <View style={styles.orangeBadge}>
              <Text style={styles.orangeBadgeText}>Level 3 Prep</Text>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <MetricItem label="Accuracy Rate" value={`${scorePct}%`} highlight />
            <View style={styles.metricDivider} />
            <MetricItem label="Tests Attempted" value={`${testsTaken}`} />
            <View style={styles.metricDivider} />
            <MetricItem label="Overall Rank" value="#42" />
          </View>
        </LinearGradient>

        {/* Interactive Filter Pills */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
              Subject Mastery
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, activeFilter === 'recent' && styles.filterChipActive]}
            onPress={() => setActiveFilter('recent')}
          >
            <Text style={[styles.filterChipText, activeFilter === 'recent' && styles.filterChipTextActive]}>
              Test History
            </Text>
          </Pressable>
        </View>

        {activeFilter === 'all' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Topic Accuracy Breakdown</Text>
            <SubjectProgressRow name="Physics & Aptitude" percent={82} color={colors.blue} />
            <SubjectProgressRow name="General Science & Logic" percent={scorePct} color={colors.orange} />
            <SubjectProgressRow name="Mathematics & Statistics" percent={68} color={colors.correct} />
            <SubjectProgressRow name="Core Reasoning" percent={90} color="#8B5CF6" />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Test Session</Text>
            {hasCompletedTest ? (
              <View style={styles.historyCard}>
                <View style={styles.historyTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyExam}>{useTestStore.getState().activeTestMeta.examName}</Text>
                    <Text style={styles.historySub}>Completed just now</Text>
                  </View>
                  <Badge label={`${result.score} / ${result.totalQuestions}`} tone="correct" />
                </View>
                <Button
                  label="View Full Result Breakdown"
                  variant="secondary"
                  onPress={() => navigation.navigate('Result')}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No test history yet</Text>
                <Text style={styles.emptyBody}>Take your first mock test to generate personalized progress insights.</Text>
                <Button
                  label="Start Mock Test"
                  onPress={() => navigation.navigate('TestTab')}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            )}
          </View>
        )}

        {/* Motivational Banner */}
        <View style={styles.orangeBanner}>
          <Text style={styles.orangeBannerTitle}>🔥 Practice Streak: 3 Days</Text>
          <Text style={styles.orangeBannerBody}>Consistent practice improves retention by 40%. Keep going!</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function MetricItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.metricItem}>
      <Text style={[styles.metricValue, highlight && { color: colors.orange }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function SubjectProgressRow({ name, percent, color }: { name: string; percent: number; color: string }) {
  return (
    <View style={styles.subjectRow}>
      <View style={styles.subjectHeader}>
        <Text style={styles.subjectName}>{name}</Text>
        <Text style={[styles.subjectPercent, { color }]}>{percent}%</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  header: { marginBottom: spacing.lg },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },

  profileCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatarPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.white },
  profileName: { fontSize: 16, fontWeight: '700', color: colors.white },
  profileExam: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  orangeBadge: {
    backgroundColor: colors.orangeTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
  },
  orangeBadgeText: { fontSize: 11, fontWeight: '700', color: colors.orangeDeep },

  metricsGrid: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.sm },
  metricItem: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 20, fontWeight: '800', color: colors.white },
  metricLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  metricDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' },

  filterRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  filterChipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterChipTextActive: { color: colors.white },

  section: { marginBottom: spacing.xl },
  sectionTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.md },

  subjectRow: { marginBottom: spacing.md },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  subjectName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  subjectPercent: { fontSize: 14, fontWeight: '800' },
  barTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  historyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  historyTop: { flexDirection: 'row', alignItems: 'center' },
  historyExam: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  historySub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  emptyTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 4 },
  emptyBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  orangeBanner: {
    backgroundColor: colors.orangeTint,
    borderColor: colors.orangeBorder,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  orangeBannerTitle: { fontSize: 15, fontWeight: '700', color: colors.orangeDeep, marginBottom: 4 },
  orangeBannerBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
