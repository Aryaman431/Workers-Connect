import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { usePressScale } from '../theme/motion';
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
  const press = usePressScale('button');
  const pulse = useSharedValue(0);

  // Spoken feedback is opacity-only (no scaling) on a ≥1200ms cycle.
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value * 0.25,
  }));

  const handlePress = () => {
    speak(label);
    pulse.value = withSequence(
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 800 })
    );
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`Read aloud: ${label}`}
      hitSlop={6}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        dark ? styles.dark : styles.light,
        press.style,
        pulseStyle,
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
});

export default SpeakerButton;
