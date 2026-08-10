import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../theme/theme';
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
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        autoPlay
        loop={false}
        style={styles.animation}
        source={require('../../assets/checklist.json')}
        onAnimationFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper, // Or whatever background color you want for the splash screen
  },
  animation: {
    width: 400,
    height: 400,
  },
});
