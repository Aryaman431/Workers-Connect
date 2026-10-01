import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  /** Screen background color — defaults to the theme `bg`. */
  bg?: string;
  /** Adds default screen padding (horizontal + bottom). */
  padded?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

/** Standard screen wrapper: safe-area aware background container. */
export function Screen({ children, bg = colors.bg, padded = false, edges = ['top'], style }: Props) {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: bg }, padded && styles.padded, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});

export default Screen;
