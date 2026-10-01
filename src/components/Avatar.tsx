import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, typography } from '../theme';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<Size, { box: number; text: number }> = {
  sm: { box: 40, text: 15 },
  md: { box: 52, text: 19 },
  lg: { box: 68, text: 25 },
  xl: { box: 96, text: 36 },
};

type Props = {
  name: string;
  color?: string;
  size?: Size;
  online?: boolean;
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Initials avatar — deterministic color, no remote images. */
export function Avatar({ name, color = colors.primary, size = 'md', online }: Props) {
  const { box, text } = SIZES[size];
  const initials = useMemo(() => initialsOf(name), [name]);

  return (
    <View
      style={[
        styles.wrap,
        { width: box, height: box, borderRadius: box / 2, backgroundColor: color },
        online && [styles.ring, { borderColor: colors.success }],
      ]}
    >
      <Text style={[styles.text, { fontSize: text }]} accessibilityElementsHidden>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 3, borderColor: colors.success },
  text: { ...typography.bodyBold, color: colors.white, fontWeight: '800', letterSpacing: 0.5 },
  radiusPill: { borderRadius: radius.pill },
});

export default Avatar;
