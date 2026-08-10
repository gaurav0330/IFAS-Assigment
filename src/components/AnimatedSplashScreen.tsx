import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import Logo from './Logo';
import { colors, radius, spacing, typography } from '../theme/theme';
import * as SplashScreen from 'expo-splash-screen';

interface Props {
  onFinish: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: Props) {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Hide the native splash screen as soon as our Lottie component mounts
    SplashScreen.hideAsync().catch(() => {
      // Ignore errors if it's already hidden
    });

    const fallbackTimer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(fallbackTimer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Top Brand Header */}
      <View style={styles.brandCard}>
        <Logo size="lg" />
      </View>

      {/* Center Lottie Animation — Person Ticking Checklist */}
      <LottieView
        ref={animation}
        autoPlay
        loop={false}
        style={styles.animation}
        source={require('../../assets/checklist.json')}
        onAnimationFinish={onFinish}
      />

      <Text style={styles.tagline}>India's #1 Competitive Exam Prep Platform</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.lg,
  },
  brandCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  animation: {
    width: 320,
    height: 320,
  },
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
