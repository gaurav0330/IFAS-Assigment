import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../components/Logo';
import { colors, radius, shadow, spacing, typography } from '../theme/theme';
import { useUserStore } from '../store/userStore';
import { useTestStore } from '../store/testStore';
import { generateTestQuestions, TEST_CONFIGS } from '../data/mockQuestions';

/* ------------------------------------------------------------------ */
/*  Helix motif — a small brand flourish echoing the DNA strand        */
/*  in the IfAS mark. Built from plain Views (two staggered columns    */
/*  of dots + connecting rungs), no extra dependencies required.       */
/* ------------------------------------------------------------------ */

type HelixPoint = { x: number; y: number };

function buildHelix(width: number, height: number, dots: number, turns = 1.6): HelixPoint[] {
  return Array.from({ length: dots }).map((_, i) => {
    const t = dots === 1 ? 0 : i / (dots - 1);
    const angle = t * Math.PI * 2 * turns;
    return { x: Math.sin(angle) * (width / 2), y: t * height };
  });
}

const HELIX_HEADER = buildHelix(12, 32, 5, 1.3);
const HELIX_CARD = buildHelix(34, 104, 7, 1.7);
const HELIX_FOOTER = buildHelix(10, 24, 4, 1.2);

function Helix({
  points,
  width,
  dotColor = colors.blue,
  fadeDotColor = colors.textMuted,
  rungColor = colors.blue,
  opacity = 1,
  style,
}: {
  points: HelixPoint[];
  width: number;
  dotColor?: string;
  fadeDotColor?: string;
  rungColor?: string;
  opacity?: number;
  style?: any;
}) {
  const height = points[points.length - 1].y + 6;
  return (
    <View style={[{ width, height, opacity }, style]} pointerEvents="none">
      {points.map((p, i) => {
        const xA = width / 2 + p.x;
        const xB = width / 2 - p.x;
        return (
          <React.Fragment key={i}>
            {i % 2 === 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: p.y,
                  left: Math.min(xA, xB),
                  width: Math.max(Math.abs(xA - xB), 1),
                  height: 1,
                  backgroundColor: rungColor,
                  opacity: 0.35,
                }}
              />
            )}
            <View style={[styles.helixDot, { top: p.y - 2, left: xA - 2, backgroundColor: dotColor }]} />
            <View style={[styles.helixDot, { top: p.y - 2, left: xB - 2, backgroundColor: fadeDotColor, opacity: 0.5 }]} />
          </React.Fragment>
        );
      })}
    </View>
  );
}

/* Small twin-dot + rung accent used before section titles — a tiny
   nod to the same DNA rung shape, reused as a typographic mark. */
function SectionDots() {
  return (
    <View style={styles.sectionDots}>
      <View style={styles.sectionDotInk} />
      <View style={styles.sectionDotRung} />
      <View style={styles.sectionDotBlue} />
    </View>
  );
}

function useGreeting() {
  const [greeting, setGreeting] = useState({ text: 'Good morning', motivation: "Rise and shine! Let's conquer today's goals." });

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting({ text: 'Good morning', motivation: "Rise and shine! Let's conquer today's goals." });
      } else if (hour >= 12 && hour < 17) {
        setGreeting({ text: 'Good afternoon', motivation: "Keep the momentum going, you are doing great!" });
      } else if (hour >= 17 && hour < 21) {
        setGreeting({ text: 'Good evening', motivation: "Wind down your day with some productive revision." });
      } else {
        setGreeting({ text: 'Good night', motivation: "Rest well! Tomorrow is another opportunity to excel." });
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}

const PROGRESS = 0.65;
const RING_SIZE = 52;

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const profile = useUserStore((s) => s.profile);
  const firstName = profile?.firstName || 'Gaurav';
  const initial = firstName.charAt(0).toUpperCase();
  const { text: greeting, motivation } = useGreeting();
  const result = useTestStore((s) => s.result);
  const phase = useTestStore((s) => s.phase);
  const examTarget = profile?.exam ? profile.exam : 'NEET UG';

  function handleStartQuickTest() {
    if (!profile) {
      Alert.alert('Profile Required', 'Please complete your profile details before taking a test.', [
        { text: 'Complete Profile', onPress: () => navigation.navigate('ProfileTab') },
      ]);
      return;
    }
    const meta = {
      ...TEST_CONFIGS.quick,
      examName: `${examTarget} Quick Practice Test`,
    };
    setupNewTest(meta, generateTestQuestions(meta.totalQuestions));
    navigation.navigate('TestTab');
  }

  function handleStartFullTest() {
    if (!profile) {
      Alert.alert('Profile Required', 'Please complete your profile details before taking a test.', [
        { text: 'Complete Profile', onPress: () => navigation.navigate('ProfileTab') },
      ]);
      return;
    }
    const meta = {
      ...TEST_CONFIGS.full,
      examName: `${examTarget} Full Length Grand Test`,
    };
    setupNewTest(meta, generateTestQuestions(meta.totalQuestions));
    navigation.navigate('TestTab');
  }
  const hasResult = phase === 'submitted' && result;
  const testsTakenCount = hasResult ? 1 : 0;
  const avgScoreText = hasResult ? `${Math.round((result.correctCount / result.totalQuestions) * 100)}%` : '85%';
  const overallProgressPct = hasResult ? Math.round((result.correctCount / result.totalQuestions) * 100) : 65;

  // Marker position on the progress ring, like a molecule resting on its strand.
  const markerAngle = (-90 + 360 * (overallProgressPct / 100)) * (Math.PI / 180);
  const markerX = RING_SIZE / 2 + Math.cos(markerAngle) * (RING_SIZE / 2) - 5;
  const markerY = RING_SIZE / 2 + Math.sin(markerAngle) * (RING_SIZE / 2) - 5;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, 16) + 12 }]}
      >
        {/* Top Bar with Centered Logo */}
        <View style={styles.headerTopBar}>
          <View style={styles.topBarLeftSpacer} />
          <Logo size="sm" />
          <View style={styles.topBarRight}>
            <Pressable
              style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }]}
              onPress={() => navigation.navigate('ProfileTab')}
            >
              <Text style={styles.avatarText}>{initial}</Text>
            </Pressable>
          </View>
        </View>

        {/* Greeting Banner */}
        <View style={styles.greetingRow}>
          <Text numberOfLines={1}>
            <Text style={styles.headerGreetingLabel}>{greeting}, </Text>
            <Text style={styles.headerGreetingName}>{firstName} 👋</Text>
          </Text>
        </View>

        <View style={styles.motivationBlock}>
          <Text style={styles.motivationText}>{motivation}</Text>
        </View>

        {/* Progress — hero card with a helix watermark and a marker-on-ring */}
        <View style={styles.section}>
          <View style={styles.progressCard}>
            <Helix
              points={HELIX_CARD}
              width={34}
              dotColor="rgba(249,115,22,0.6)"
              fadeDotColor="rgba(255,255,255,0.3)"
              rungColor="rgba(37,99,235,0.5)"
              style={styles.progressHelix}
            />

            <View style={styles.progressHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressExamName}>{examTarget}</Text>
                <Text style={styles.progressSub}>Exam Completion & Readiness</Text>
              </View>
              <View style={styles.ringWrap}>
                <View style={styles.progressRing}>
                  <Text style={styles.progressPercentage}>{overallProgressPct}%</Text>
                </View>
                <View style={[styles.ringMarker, { left: markerX, top: markerY }]} />
              </View>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${overallProgressPct}%` }]} />
            </View>

            <View style={styles.statsRow}>
              <StatItem value={`${testsTakenCount}`} label="Tests taken" />
              <View style={styles.statDivider} />
              <StatItem value={avgScoreText} label="Avg score" highlight />
              <View style={styles.statDivider} />
              <StatItem value="2" label="Pending" />
            </View>
          </View>
        </View>

        {/* New Tests */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <SectionDots />
              <Text style={styles.sectionTitle}>Featured Mock Tests</Text>
            </View>
            <Pressable hitSlop={8} onPress={() => navigation.navigate('TestTab')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {/* Quick Mock Test Card (Light Orange to Warm Amber Gradient) */}
            <LinearGradient
              colors={[colors.orange, colors.orangeDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.testCard, shadow.card]}
            >
              <View style={styles.testBadgeOrange}>
                <Text style={styles.testBadgeText}>POPULAR</Text>
              </View>
              <View style={styles.testIconWrapOrange}>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.white} />
              </View>
              <Text style={styles.testCardTitle}>Quick Mock Test</Text>
              <Text style={styles.testCardSub}>10 Questions · 10 mins</Text>
              <Pressable
                style={({ pressed }) => [styles.testBtnOrange, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                onPress={handleStartQuickTest}
              >
                <Text style={styles.testBtnTextOrange}>Start now</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.orangeDeep} />
              </Pressable>
            </LinearGradient>

            {/* Full Length Test Card (Royal Sapphire Blue) */}
            <LinearGradient
              colors={[colors.blue, colors.blueDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.testCard, shadow.card]}
            >
              <View style={styles.testBadge}>
                <Text style={styles.testBadgeText}>FULL 30Q</Text>
              </View>
              <View style={styles.testIconWrap}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={20} color={colors.white} />
              </View>
              <Text style={styles.testCardTitle}>Full Length Test</Text>
              <Text style={styles.testCardSub}>30 Questions · 45 mins</Text>
              <Pressable
                style={({ pressed }) => [styles.testBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                onPress={handleStartFullTest}
              >
                <Text style={styles.testBtnText}>Start now</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.blue} />
              </Pressable>
            </LinearGradient>
          </ScrollView>
        </View>

        {/* Notice board */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <SectionDots />
            <Text style={styles.sectionTitle}>Latest Updates & Notices</Text>
          </View>

          <NoticeCard
            icon={<MaterialCommunityIcons name="bullhorn-outline" size={18} color={colors.orangeDeep} />}
            title={`${examTarget} Official Admit Cards`}
            body="Admit cards for upcoming session are now available for download."
            time="2h ago"
          />
          <NoticeCard
            icon={<Ionicons name="ribbon-outline" size={18} color={colors.blue} />}
            title="All-India Mock Test Ranklist"
            body="Ranklists declared! Check your percentile and top scores."
            time="1d ago"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function StatItem({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, highlight && { color: colors.orange }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function NoticeCard({
  icon,
  title,
  body,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  time: string;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.noticeCard, pressed && styles.noticeCardPressed]}>
      <View style={styles.noticeIconWrap}>
        <View style={styles.noticeIconRing} />
        {icon}
      </View>
      <View style={styles.noticeContent}>
        <Text style={styles.noticeTitle}>{title}</Text>
        <Text style={styles.noticeBody} numberOfLines={2}>
          {body}
        </Text>
      </View>
      <Text style={styles.noticeTime}>{time}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: spacing.xl },

  helixDot: { position: 'absolute', width: 4, height: 4, borderRadius: 2 },

  headerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  topBarLeftSpacer: { width: 40 },
  topBarRight: { width: 40, alignItems: 'flex-end' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.blueTint,
    borderWidth: 1.5,
    borderColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '600', color: colors.blueDeep },

  greetingRow: { paddingHorizontal: spacing.lg, marginTop: spacing.xs },
  headerGreetingLabel: { ...typography.body, color: colors.textSecondary, fontSize: 16, fontWeight: '400' },
  headerGreetingName: { ...typography.body, color: colors.textPrimary, fontSize: 16, fontWeight: '700' },

  motivationBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.xl },
  motivationText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 19,
  },

  section: { marginBottom: spacing.xxl },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionDots: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  sectionDotInk: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.ink },
  sectionDotRung: { width: 9, height: 1.5, backgroundColor: colors.blue, marginHorizontal: 3 },
  sectionDotBlue: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.blue },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  seeAll: { fontSize: 13, fontWeight: '500', color: colors.blue },

  /* Progress hero card — carries the helix watermark + ring marker */
  progressCard: {
    backgroundColor: colors.ink,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHelix: { position: 'absolute', top: -8, right: 10 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressExamName: { fontSize: 15, fontWeight: '700', color: colors.white },
  progressSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  ringWrap: { width: RING_SIZE, height: RING_SIZE },
  progressRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(37,99,235,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: { fontSize: 13, fontWeight: '800', color: colors.white },
  ringMarker: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 3 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '800', color: colors.white },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 3, fontSize: 11 },
  statDivider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.12)' },

  /* Test cards */
  horizontalScrollContent: { paddingHorizontal: spacing.lg, paddingRight: spacing.lg * 2 },
  testCard: {
    width: 220,
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginRight: spacing.md,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  testCardAlt: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  testBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  testBadgeOrange: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  testBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  testBadgeAlt: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.blueTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  testBadgeAltText: { color: colors.blue, fontSize: 10, fontWeight: '700' },
  testIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  testIconWrapOrange: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  testIconWrapAlt: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  testCardTitle: { fontSize: 16, fontWeight: '700', color: colors.white, marginTop: spacing.md },
  testCardSub: { fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginTop: 3, marginBottom: spacing.lg },
  testCardSubAlt: { fontSize: 12.5, color: colors.textSecondary, marginTop: 3, marginBottom: spacing.lg },
  testBtn: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 6,
  },
  testBtnOrange: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 6,
  },
  testBtnAlt: { backgroundColor: colors.blue },
  testBtnText: { fontSize: 13.5, fontWeight: '700', color: colors.blue },
  testBtnTextOrange: { fontSize: 13.5, fontWeight: '700', color: colors.orangeDeep },

  /* Notices */
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  noticeCardPressed: { opacity: 0.8, transform: [{ scale: 0.99 }] },
  noticeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  noticeIconRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.blueTintStrong,
  },
  noticeContent: { flex: 1, marginRight: spacing.sm },
  noticeTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  noticeBody: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 16 },
  noticeTime: { fontSize: 11, color: colors.textMuted, alignSelf: 'flex-start', marginTop: 2, fontWeight: '500' },

  footer: { alignItems: 'center', marginTop: spacing.md, paddingBottom: spacing.xl },
  footerText: { fontSize: 11, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.3 },
});