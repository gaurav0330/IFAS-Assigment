import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Logo from './Logo';
import { colors, spacing, typography } from '../theme/theme';
import * as SplashScreen from 'expo-splash-screen';

interface Props {
  onFinish: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: Props) {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    const timer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Logo size="lg" />
      <ActivityIndicator color={colors.blue} size="large" style={{ marginTop: spacing.xl }} />
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
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
