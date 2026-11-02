import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { colors, radius, spacing, typography } from '../theme';
import { usePressScale } from '../theme/motion';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

/** Compact filter chip toggle (min 40px tall) with a press-scale response. */
export function FilterChip({ label, active = false, onPress }: Props) {
  const press = usePressScale('control');

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[styles.chip, active && styles.chipActive, press.style]}
    >
      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { ...typography.label, color: colors.dark },
  labelActive: { color: colors.white, fontWeight: '800' },
});

export default FilterChip;
