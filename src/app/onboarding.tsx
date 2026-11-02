import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton, Screen, AppIcon, TextilePattern } from '../components';
import { colors, radius, spacing, typography } from '../theme';
import { enter, layoutSoft } from '../theme/motion';
import { skills } from '../data/mockData';

type Panel = {
  headline: string;
  support: string;
  visual: 'skills' | 'connect' | 'simple';
  gradient: [string, string];
};

const PANELS: Panel[] = [
  {
    headline: 'Skills should speak for themselves.',
    support: 'Show what you can do using simple visual skills.',
    visual: 'skills',
    gradient: [colors.navy, colors.primary],
  },
  {
    headline: 'Find the right connection.',
    support: 'Workers and employers connect directly.',
    visual: 'connect',
    gradient: [colors.primary, colors.accent],
  },
  {
    headline: 'Built for real workers.',
    support: 'Simple visuals. Clear choices. Less typing.',
    visual: 'simple',
    gradient: [colors.navy, colors.primaryDark],
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const isLast = index === PANELS.length - 1;

  const handleScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      if (next !== index && next >= 0 && next < PANELS.length) setIndex(next);
    },
    [index, width]
  );

  const advance = () => {
    if (isLast) {
      router.replace('/role');
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    setIndex(index + 1);
  };

  const skip = () => router.replace('/role');

  return (
    <Screen bg={colors.bg} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brand}>WORKER CONNECT</Text>
        </View>
        <Pressable
          onPress={skip}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          hitSlop={10}
          style={({ pressed }) => [styles.skip, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        {PANELS.map((panel, i) => (
          <View key={panel.headline} style={[styles.panel, { width }]}>
            <Visual kind={panel.visual} gradient={panel.gradient} />
            <Animated.View entering={enter.fadeUp(120)} style={styles.copy}>
              <Text style={styles.headline} accessibilityRole="header">
                {panel.headline}
              </Text>
              <Text style={styles.support}>{panel.support}</Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots} accessibilityLabel={`Page ${index + 1} of ${PANELS.length}`}>
        {PANELS.map((p, i) => (
          <Animated.View
            key={p.headline}
            layout={layoutSoft}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label={isLast ? 'Get Started' : 'Continue'} onPress={advance} />
      </View>
    </Screen>
  );
}

function Visual({ kind, gradient }: { kind: Panel['visual']; gradient: [string, string] }) {
  return (
    <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.visual}>
      <TextilePattern color={colors.white} opacity={0.08} count={12} />

      {kind === 'skills' && (
        <View style={styles.skillGrid}>
          {skills.slice(0, 6).map((s, i) => (
            <Animated.View key={s.id} entering={enter.listRow(i)} style={styles.skillTile}>
              <AppIcon lib={s.icon.lib} name={s.icon.name} size={30} color={colors.white} />
            </Animated.View>
          ))}
        </View>
      )}

      {kind === 'connect' && (
        <View style={styles.connectRow}>
          <View style={styles.node}>
            <Ionicons name="person" size={36} color={colors.white} />
            <Text style={styles.nodeLabel}>Worker</Text>
          </View>
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <View style={styles.connectorPulse} />
          </View>
          <View style={styles.node}>
            <AppIcon lib="MaterialCommunityIcons" name="factory" size={36} color={colors.white} />
            <Text style={styles.nodeLabel}>Employer</Text>
          </View>
        </View>
      )}

      {kind === 'simple' && (
        <View style={styles.simpleRow}>
          <View style={styles.node}>
            <Ionicons name="hand-left" size={40} color={colors.white} />
            <Text style={styles.nodeLabel}>Tap</Text>
          </View>
          <Ionicons name="arrow-forward" size={26} color={colors.white} />
          <View style={styles.node}>
            <Ionicons name="checkmark-circle" size={44} color={colors.white} />
            <Text style={styles.nodeLabel}>Done</Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  brand: { ...typography.caption, fontWeight: '800', letterSpacing: 1.6, color: colors.dark },
  skip: { minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.sm },
  skipText: { ...typography.label, color: colors.primary, fontWeight: '800' },
  pager: { flex: 1 },
  panel: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'center', gap: spacing.xl },
  visual: {
    height: 300,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: spacing.xl,
  },
  copy: { gap: spacing.sm },
  headline: { ...typography.h1, color: colors.dark },
  support: { ...typography.body, color: colors.muted, fontSize: 17 },
  skillGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 216, justifyContent: 'center', gap: spacing.md },
  skillTile: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  node: { alignItems: 'center', gap: spacing.sm },
  nodeLabel: { ...typography.label, color: colors.white, fontWeight: '700' },
  connector: { width: 74, alignItems: 'center', justifyContent: 'center' },
  connectorLine: { height: 3, width: '100%', backgroundColor: colors.white, borderRadius: 2, opacity: 0.8 },
  connectorPulse: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.white,
    opacity: 0.9,
  },
  simpleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 26, backgroundColor: colors.primary },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
