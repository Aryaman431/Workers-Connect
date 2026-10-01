import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../theme';
import { useAppState } from '../state/AppContext';

type Props = {
  /** The phrase this button "speaks" (mock voice affordance). */
  label: string;
  size?: number;
  dark?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Circular speaker button that triggers the mock `speak()` affordance. */
export function SpeakerButton({ label, size = 44, dark = false }: Props) {
  const { speak } = useAppState();
  const pulse = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.12 }],
    opacity: 1 - pulse.value * 0.25,
  }));

  const handlePress = () => {
    speak(label);
    pulse.value = withSequence(
      withTiming(1, { duration: 140 }),
      withTiming(0, { duration: 260 })
    );
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={() => {
        pulse.value = withSpring(0.5, { damping: 14, stiffness: 300 });
      }}
      onPressOut={() => {
        pulse.value = withSpring(0, { damping: 14, stiffness: 220 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`Read aloud: ${label}`}
      hitSlop={6}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        dark ? styles.dark : styles.light,
        animatedStyle,
      ]}
    >
      <Ionicons name="volume-high" size={size * 0.45} color={dark ? colors.white : colors.primary} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  light: { backgroundColor: colors.surface, borderColor: colors.border },
  dark: { backgroundColor: colors.darkSurface, borderColor: colors.darkMuted },
  radiusPill: { borderRadius: radius.pill },
  gap: { margin: spacing.xs },
});

export default SpeakerButton;
