import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { colors, radius, spacing, typography } from '../theme';
import { usePressScale } from '../theme/motion';

type Props = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  tone?: 'default' | 'dark';
  style?: StyleProp<ViewStyle>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Secondary (outlined/soft) button — same 56px height as the primary button. */
export function SecondaryButton({ label, onPress, icon, disabled = false, tone = 'default', style }: Props) {
  const press = usePressScale('button');

  const dark = tone === 'dark';

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[
        styles.button,
        dark ? styles.darkBg : styles.lightBg,
        press.style,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.inner}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.label, { color: dark ? colors.white : colors.primary }]} numberOfLines={1}>
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
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  lightBg: { backgroundColor: colors.surface, borderColor: colors.primary },
  darkBg: { backgroundColor: 'transparent', borderColor: colors.darkMuted },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  icon: { marginRight: spacing.xs },
  label: { ...typography.bodyBold, textAlign: 'center' },
  disabled: { opacity: 0.45 },
});

export default SecondaryButton;
