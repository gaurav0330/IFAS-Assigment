import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { radius } from '../theme/theme';

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const logoSource = require('../../assets/ifas_edutech_pvt_ltd_logo.jpg');

export default function Logo({ size = 'sm' }: Props) {
  const isLg = size === 'lg';
  const isMd = size === 'md';

  return (
    <View style={styles.container}>
      <Image
        source={logoSource}
        style={isLg ? styles.imageLg : isMd ? styles.imageMd : styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  image: { width: 125, height: 42 },
  imageMd: { width: 160, height: 52 },
  imageLg: { width: 220, height: 72 },
});

