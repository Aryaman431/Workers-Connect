import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { absoluteFill, glass } from '../theme';

export type GlassSurfaceProps = {
  children: ReactNode;
  /** Blur strength — defaults to `glass.intensity`. */
  intensity?: number;
  tone?: 'light' | 'dark';
  emphasis?: 'regular' | 'strong';
  style?: StyleProp<ViewStyle>;
};

/**
 * Translucent, blurred panel.
 *
 * Layer order: BlurView → tint fill → hairline border → children.
 *
 * The root wrapper carries `overflow: 'hidden'` because React Native does not
 * apply `borderRadius` clipping to `BlurView` itself — without it the blur
 * would bleed past the rounded corners. The root also accepts positioning and
 * radius through `style`, so callers can absolutely place a glass sheet.
 */
export function GlassSurface({
  children,
  intensity,
  tone = 'light',
  emphasis = 'regular',
  style,
}: GlassSurfaceProps) {
  const dark = tone === 'dark';
  const fill = dark ? glass.darkFill : emphasis === 'strong' ? glass.fillStrong : glass.fill;
  const edge = dark ? glass.darkBorder : glass.border;
  const tint = dark ? 'dark' : glass.tint;

  return (
    <View style={[styles.root, style]}>
      <BlurView pointerEvents="none" intensity={intensity ?? glass.intensity} tint={tint} style={absoluteFill} />
      <View pointerEvents="none" style={[absoluteFill, { backgroundColor: fill }]} />
      <View pointerEvents="none" style={[absoluteFill, styles.edge, { borderColor: edge }]} />
      <View pointerEvents="none" style={[absoluteFill, styles.edge, { borderColor: glass.hairline }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  edge: {
    borderWidth: 1,
  },
});

export default GlassSurface;
