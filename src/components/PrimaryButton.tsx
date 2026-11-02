import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { colors, radius, shadows, spacing, typography } from '../theme';
import { usePressScale } from '../theme/motion';

type Props = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'accent';
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Primary call-to-action button — minimum 56px tall with a press-scale response. */
export function PrimaryButton({ label, onPress, icon, disabled = false, variant = 'primary', style }: Props) {
  const press = usePressScale('button');

  const bg = variant === 'accent' ? colors.accent : colors.primary;

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.button, { backgroundColor: bg }, shadows.card, press.style, disabled && styles.disabled, style]}
    >
      <View style={styles.inner}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  icon: { marginRight: spacing.xs },
  label: { ...typography.bodyBold, color: colors.white, textAlign: 'center' },
  disabled: { opacity: 0.45 },
});

export default PrimaryButton;
