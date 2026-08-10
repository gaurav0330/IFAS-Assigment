import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StartTestScreen from '../screens/StartTestScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import TestScreen from '../screens/TestScreen';
import ResultScreen from '../screens/ResultScreen';
import QueriesScreen from '../screens/QueriesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { colors } from '../theme/theme';
import { useTestStore } from '../store/testStore';
import { useUserStore } from '../store/userStore';

export type RootStackParamList = {
  Profile: undefined;
  StartTest: undefined;
  Instructions: undefined;
  Test: undefined;
  Result: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  TestTab: undefined;
  QueriesTab: undefined;
  ProgressTab: undefined;
  ProfileTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paper,
    primary: colors.blue,
    card: colors.white,
    text: colors.textPrimary,
    border: colors.border,
  },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const iconNames: Record<string, { active: any; inactive: any }> = {
    Home: { active: 'home', inactive: 'home-outline' },
    Test: { active: 'document-text', inactive: 'document-text-outline' },
    Queries: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
    Progress: { active: 'stats-chart', inactive: 'stats-chart-outline' },
    Profile: { active: 'person', inactive: 'person-outline' },
  };

  const name = focused ? iconNames[label]?.active : iconNames[label]?.inactive;
  const iconColor = focused ? colors.blue : colors.textMuted;

  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapFocused]}>
      <Ionicons name={name || 'ellipse'} size={22} color={iconColor} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  iconWrapFocused: { transform: [{ scale: 1.05 }] },
});

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});

// Test flow as a nested stack navigator
function TestStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="StartTest" component={StartTestScreen} />
      <Stack.Screen name="Instructions" component={InstructionsScreen} />
      <Stack.Screen name="Test" component={TestScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const profile = useUserStore((s) => s.profile);

  return (
    <Tab.Navigator
      initialRouteName={profile ? 'HomeTab' : 'ProfileTab'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="TestTab"
        component={TestStackNavigator}
        options={{
          tabBarLabel: 'Test',
          tabBarIcon: ({ focused }) => <TabIcon label="Test" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="QueriesTab"
        component={QueriesScreen}
        options={{
          tabBarLabel: 'Queries',
          tabBarIcon: ({ focused }) => <TabIcon label="Queries" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({ focused }) => <TabIcon label="Progress" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

import AnimatedSplashScreen from '../components/AnimatedSplashScreen';

export const navigationRef = createNavigationContainerRef<any>();

export default function RootNavigator() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useTestStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useTestStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  if (!hydrated) {
    return <AnimatedSplashScreen onFinish={() => setHydrated(true)} />;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <MainTabs />
    </NavigationContainer>
  );
}
