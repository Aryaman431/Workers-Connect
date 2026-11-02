import { Easing, FadeIn, FadeInDown, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

/**
 * Shared motion language for the whole app.
 * Everything is timing-based (no springs) so presses feel crisp and entrances
 * stay on a single, predictable curve.
 */
export const motion = {
  duration: { press: 140, quick: 180, base: 240, slow: 320, max: 350 },
  easing: { out: Easing.out(Easing.cubic), inOut: Easing.inOut(Easing.quad) },
  scale: { button: 0.985, card: 0.99, control: 0.97 },
} as const;

/**
 * Entering presets.
 *
 * Reanimated 4.x has no `.translateY(n)` chain method on entering builders, so
 * the initial offset is set through `.withInitialValues({ translateY })`, which
 * is the supported way to override the builder's start values.
 */
export const enter = {
  fadeUp: (delay = 0) =>
    FadeInDown.duration(260).delay(delay).easing(motion.easing.out).withInitialValues({ translateY: 10 }),
  fade: (delay = 0) => FadeIn.duration(220).delay(delay),
  quick: (delay = 0) => FadeInDown.duration(180).delay(delay).withInitialValues({ translateY: 6 }),
  listRow: (i = 0) =>
    FadeInDown.duration(260)
      .delay(Math.min(i, 5) * 50)
      .easing(motion.easing.out)
      .withInitialValues({ translateY: 8 }),
} as const;

export const exit = { fade: FadeOut.duration(160) } as const;

export const layoutSoft = LinearTransition.duration(220).easing(motion.easing.out);

/** Subtle press-scale feedback for buttons, cards, and controls. */
export function usePressScale(kind: keyof typeof motion.scale = 'button') {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onPressIn = () => {
    scale.value = withTiming(motion.scale[kind], { duration: motion.duration.press, easing: motion.easing.out });
  };
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: motion.duration.quick, easing: motion.easing.out });
  };
  return { style, onPressIn, onPressOut };
}
