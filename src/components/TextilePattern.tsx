import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { absoluteFill, colors } from '../theme';

type Props = {
  color?: string;
  opacity?: number;
  /** Number of woven diagonal lines. */
  count?: number;
  /**
   * Pattern family:
   * - `weave` — diagonal + horizontal threads (default, original behaviour)
   * - `grid` — vertical + horizontal 1px lines
   * - `stitch` — horizontal dashed seam lines only
   */
  variant?: 'weave' | 'grid' | 'stitch';
  style?: StyleProp<ViewStyle>;
};

/**
 * Subtle textile-inspired background built from thin Views (no images/SVG).
 * Keeps opacity low so it never competes with foreground content.
 * Always decorative: hidden from assistive tech and non-interactive.
 */
export function TextilePattern({
  color = colors.navy,
  opacity = 0.06,
  count = 14,
  variant = 'weave',
  style,
}: Props) {
  const lines = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  let threads: React.ReactNode = null;

  if (variant === 'grid') {
    threads = (
      <>
        {lines.map((i) => (
          <View key={`v-${i}`} style={[styles.vline, { backgroundColor: color, opacity, left: `${(i * 100) / count}%` }]} />
        ))}
        {lines.map((i) => (
          <View key={`h-${i}`} style={[styles.cross, { backgroundColor: color, opacity: opacity * 0.7, top: `${(i * 100) / count}%` }]} />
        ))}
      </>
    );
  } else if (variant === 'stitch') {
    threads = lines.map((i) => (
      <View
        key={`s-${i}`}
        style={[styles.stitch, { borderColor: color, opacity, top: `${(i * 100) / count}%` }]}
      />
    ));
  } else {
    threads = (
      <>
        {lines.map((i) => (
          <View key={`d-${i}`} style={[styles.diag, { backgroundColor: color, opacity, left: `${(i * 100) / count - 20}%` }]} />
        ))}
        {lines.map((i) => (
          <View key={`h-${i}`} style={[styles.cross, { backgroundColor: color, opacity: opacity * 0.7, top: `${(i * 100) / count}%` }]} />
        ))}
      </>
    );
  }

  return (
    <View pointerEvents="none" style={[styles.wrap, style]} accessibilityElementsHidden importantForAccessibility="no">
      {threads}
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
  vline: {
    position: 'absolute',
    width: 1,
    height: '140%',
    top: '-20%',
  },
  stitch: {
    position: 'absolute',
    height: 0,
    width: '140%',
    left: '-20%',
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
});

export default TextilePattern;
