import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

export type StatusBadgeVariant = 'success' | 'warning' | 'muted';

const TONES: Record<StatusBadgeVariant, { bg: string; dot: string; fg: string }> = {
  success: { bg: colors.successSoft, dot: colors.success, fg: colors.success },
  warning: { bg: '#F8EEDB', dot: colors.warning, fg: '#9A6A16' },
  muted: { bg: colors.chipBg, dot: colors.muted, fg: colors.muted },
};

type Props = {
  label: string;
  variant?: StatusBadgeVariant;
  style?: StyleProp<ViewStyle>;
};

/** Pill status badge with a leading dot — e.g. "AVAILABLE FOR WORK". */
export function StatusBadge({ label, variant = 'success', style }: Props) {
  const tone = TONES[variant];
  return (
    <View style={[styles.pill, { backgroundColor: tone.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: tone.dot }]} />
      <Text style={[styles.label, { color: tone.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    gap: spacing.xs + 2,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { ...typography.caption, fontWeight: '800', fontSize: 11, letterSpacing: 0.6 },
});

export default StatusBadge;
