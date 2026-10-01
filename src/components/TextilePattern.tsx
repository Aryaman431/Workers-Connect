import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { absoluteFill, colors } from '../theme';

type Props = {
  color?: string;
  opacity?: number;
  /** Number of woven diagonal lines. */
  count?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Subtle textile-inspired background built from thin Views (no images/SVG).
 * Keeps opacity low so it never competes with foreground content.
 */
export function TextilePattern({ color = colors.navy, opacity = 0.06, count = 14, style }: Props) {
  const lines = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <View pointerEvents="none" style={[styles.wrap, style]} accessibilityElementsHidden importantForAccessibility="no">
      {lines.map((i) => (
        <View key={`d-${i}`} style={[styles.diag, { backgroundColor: color, opacity, left: `${(i * 100) / count - 20}%` }]} />
      ))}
      {lines.map((i) => (
        <View key={`h-${i}`} style={[styles.cross, { backgroundColor: color, opacity: opacity * 0.7, top: `${(i * 100) / count}%` }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...absoluteFill, overflow: 'hidden' },
  diag: {
    position: 'absolute',
    width: 1,
    height: 400,
    top: -80,
    transform: [{ rotate: '24deg' }],
  },
  cross: {
    position: 'absolute',
    height: 1,
    width: '140%',
    left: '-20%',
  },
});

export default TextilePattern;
