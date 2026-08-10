import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';
import ActiveTestBanner from './src/components/ActiveTestBanner';

// Keep the native splash screen visible until our JS is ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // In a real app, you might load fonts/assets here.
    // For now, just mark it ready immediately so the AnimatedSplashScreen can take over.
    setAppIsReady(true);
  }, []);

  if (!appIsReady || !animationFinished) {
    return (
      <AnimatedSplashScreen
        onFinish={() => {
          setAnimationFinished(true);
        }}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ActiveTestBanner />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
