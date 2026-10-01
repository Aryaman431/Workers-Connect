import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { absoluteFill, colors, radius, shadows, spacing, typography } from '../theme';

type Props = {
  available?: boolean;
  onToggle?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Hero availability card on the worker home screen.
 * Dark navy surface, huge status text, subtle glow while available.
 */
export function AvailabilityToggle({ available = true, onToggle }: Props) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const knob = useSharedValue(available ? 1 : 0);

  useEffect(() => {
    knob.value = withSpring(available ? 1 : 0, { damping: 18, stiffness: 220 });
    if (available) {
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 1400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      glow.value = withTiming(0, { duration: 250 });
    }
  }, [available, glow, knob]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: available ? 0.25 + glow.value * 0.5 : 0,
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knob.value * 30 }],
  }));

  return (
    <AnimatedPressable
      onPress={onToggle}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 260 });
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: available }}
      accessibilityLabel={available ? 'You are available for work. Tap to go offline.' : 'You are not available. Tap to go online.'}
      style={[styles.card, shadows.elevated, cardStyle]}
    >
      <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />

      <View style={styles.row}>
        <View style={styles.textCol}>
          <Text style={styles.kicker}>TODAY I AM</Text>
          <Text style={[styles.status, !available && styles.statusOff]} numberOfLines={1}>
            {available ? 'AVAILABLE' : 'NOT AVAILABLE'}
          </Text>
          <Text style={styles.sub}>Employers can find you.</Text>
        </View>

        <View style={[styles.switch, available && styles.switchOn]}>
          <Animated.View style={[styles.knob, knobStyle]}>
            <Ionicons name={available ? 'checkmark' : 'close'} size={16} color={available ? colors.white : colors.muted} />
          </Animated.View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 148,
    borderRadius: radius.xl,
    backgroundColor: colors.navy,
    padding: spacing.xl,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  glow: {
    ...absoluteFill,
    backgroundColor: colors.success,
    opacity: 0.18,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  textCol: { flex: 1, gap: spacing.xs },
  kicker: { ...typography.caption, color: colors.darkMuted, fontWeight: '800', letterSpacing: 1.4 },
  status: { ...typography.display, color: colors.white, fontSize: 34, lineHeight: 40 },
  statusOff: { color: colors.darkMuted },
  sub: { ...typography.body, color: colors.darkMuted, fontSize: 15 },
  switch: {
    width: 74,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.darkSurface,
    borderWidth: 1,
    borderColor: colors.darkMuted,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  switchOn: { backgroundColor: colors.success, borderColor: colors.success },
  knob: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AvailabilityToggle;
