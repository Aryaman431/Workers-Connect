import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Screen, TextilePattern } from '../components';
import { colors, spacing, typography } from '../theme';

const SPLASH_MS = 1400;

/** App splash: animated logo mark, accent line, wordmark, then auto-advance. */
export default function SplashScreen() {
  const mark = useSharedValue(0);
  const line = useSharedValue(0);
  const word = useSharedValue(0);
  const navigated = useRef(false);

  useEffect(() => {
    mark.value = withTiming(1, { duration: 400 });
    line.value = withDelay(320, withTiming(1, { duration: 500 }));
    word.value = withDelay(520, withSequence(withTiming(1, { duration: 420 })));

    const timer = setTimeout(() => {
      if (navigated.current) return;
      navigated.current = true;
      router.replace('/onboarding');
    }, SPLASH_MS);

    return () => clearTimeout(timer);
  }, [line, mark, word]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: mark.value,
    transform: [{ scale: 0.6 + mark.value * 0.4 }],
  }));
  const lineStyle = useAnimatedStyle(() => ({ width: `${line.value * 100}%` }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: word.value,
    transform: [{ translateY: (1 - word.value) * 12 }],
  }));

  return (
    <Screen bg={colors.bg} edges={['top', 'bottom']}>
      <TextilePattern color={colors.navy} opacity={0.05} count={12} />

      <View style={styles.center}>
        <Animated.View style={[styles.mark, markStyle]} accessibilityLabel="Worker Connect logo">
          <View style={[styles.square, styles.squareNavy]} />
          <View style={[styles.square, styles.squareAccent]} />
          <View style={styles.thread} />
        </Animated.View>

        <Animated.View style={[styles.lineTrack, wordStyle]}>
          <Animated.View style={[styles.line, lineStyle]} />
        </Animated.View>

        <Animated.View style={[styles.wordWrap, wordStyle]}>
          <Text style={styles.word} accessibilityRole="header">
            WORKER
          </Text>
          <Text style={[styles.word, styles.wordAccent]}>CONNECT</Text>
        </Animated.View>

        <Animated.Text style={[styles.subtitle, wordStyle]}>
          Find work. Find workers. Connect directly.
        </Animated.Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.xl },
  mark: { width: 104, height: 104, alignItems: 'center', justifyContent: 'center' },
  square: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 20,
    borderWidth: 7,
  },
  squareNavy: { top: 6, left: 6, borderColor: colors.navy },
  squareAccent: { bottom: 6, right: 6, borderColor: colors.accent },
  thread: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },
  lineTrack: { height: 4, width: '62%', borderRadius: 2, backgroundColor: colors.border, overflow: 'hidden', marginTop: spacing.sm },
  line: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  wordWrap: { alignItems: 'center', gap: spacing.xs },
  word: { ...typography.display, color: colors.dark, letterSpacing: 6, fontWeight: '800' },
  wordAccent: { color: colors.primary },
  subtitle: { ...typography.body, color: colors.muted, textAlign: 'center', maxWidth: 300 },
});
