import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function ScreenContainer({ children, style, noPadding }: Props) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.safe, { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={[styles.container, !noPadding && styles.padded, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  container: { flex: 1, backgroundColor: colors.paper },
  padded: { paddingHorizontal: 20 },
});
