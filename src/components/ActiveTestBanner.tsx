import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, typography } from '../theme/theme';
import { useTestStore } from '../store/testStore';
import { navigationRef } from '../navigation/RootNavigator';

export default function ActiveTestBanner() {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const showLeaveWarning = useTestStore((s) => s.showLeaveWarning);
  const hideLeaveWarning = useTestStore((s) => s.hideLeaveWarning);
  const phase = useTestStore((s) => s.phase);

  useEffect(() => {
    if (showLeaveWarning && phase === 'in-progress') {
      // Slide down
      Animated.spring(slideAnim, {
        toValue: insets.top > 0 ? insets.top : 20,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }).start();

      // Automatically hide after 5 seconds
      const timer = setTimeout(() => {
        hideLeaveWarning();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Slide up
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showLeaveWarning, phase, insets.top, slideAnim, hideLeaveWarning]);

  function handlePressBanner() {
    hideLeaveWarning();
    if (navigationRef.isReady()) {
      navigationRef.navigate('TestTab', { screen: 'Test' });
    }
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <Pressable
        onPress={handlePressBanner}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="time" size={24} color={colors.white} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Test in Progress!</Text>
          <Text style={styles.subtitle}>
            Tap to return to your test screen →
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FF8C00', // Warning Orange
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.card,
    shadowColor: '#FF8C00',
  },
  iconWrap: {
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.white,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
});
