import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import {
  Avatar,
  AvailabilityToggle,
  GlassSurface,
  Screen,
  SectionHeader,
  SkillCard,
  TextilePattern,
} from '../../components';
import { OpportunityCard } from '../../components/WorkerFlowBits';
import { colors, radius, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { useAppState } from '../../state/AppContext';
import { opportunities, skillById, workers, type Skill } from '../../data/mockData';

const TAB_CLEARANCE = 112;

export default function WorkerHomeScreen() {
  const { available, setAvailable, selectedSkills } = useAppState();
  const me = workers.find((w) => w.id === 'w1') ?? workers[0];

  // Fallback to the mock worker's skills until the user picks their own.
  const skillIds = selectedSkills.length > 0 ? selectedSkills : me.skills;
  const displaySkills = skillIds.map(skillById).filter((s): s is Skill => Boolean(s));

  // Gentle green dot pulse while available.
  const dot = useSharedValue(0);
  useEffect(() => {
    if (available) {
      dot.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        false
      );
    } else {
      dot.value = withTiming(0, { duration: 200 });
    }
  }, [available, dot]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: available ? 0.5 * (1 - dot.value) : 0,
    transform: [{ scale: 1 + dot.value * 1.7 }],
  }));

  const goToSkills = () => router.push('/worker-tabs/skills');

  return (
    <Screen bg={colors.bg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Greeting header with a subtle textile weave behind it. */}
        <Animated.View entering={enter.fadeUp()} style={styles.headerBlock}>
          <TextilePattern color={colors.navy} opacity={0.06} count={8} />
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.name} accessibilityRole="header">
                {me.name}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/worker-tabs/profile')}
              accessibilityRole="button"
              accessibilityLabel="Open your profile"
              hitSlop={8}
              style={({ pressed }) => [styles.avatarBtn, pressed && styles.pressedSm]}
            >
              <Avatar name={me.name} color={me.avatarColor} size="md" online={available} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Hero: availability is the visual anchor of this screen. */}
        <Animated.View entering={enter.fadeUp(60)}>
          <AvailabilityToggle available={available} onToggle={() => setAvailable(!available)} />
        </Animated.View>

        {/* Live status strip — also the entry point to the availability screen. */}
        <Animated.View entering={enter.fadeUp(120)}>
          <Pressable
            onPress={() => router.push('/availability')}
            accessibilityRole="button"
            accessibilityLabel="Open availability settings"
            style={({ pressed }) => [pressed && styles.pressedSm]}
          >
            <GlassSurface tone="light" emphasis="strong" style={[styles.liveRow, { borderRadius: radius.md }]}>
              <View style={styles.dotWrap}>
                <Animated.View style={[styles.dotPulse, dotStyle]} />
                <View style={[styles.dot, { backgroundColor: available ? colors.success : colors.muted }]} />
              </View>
              <Text style={styles.liveText} numberOfLines={1}>
                {available ? 'Visible to employers right now.' : 'Hidden from employers right now.'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </GlassSurface>
          </Pressable>
        </Animated.View>

        {/* Your skills */}
        <View>
          <SectionHeader title="YOUR SKILLS" action="Edit" onAction={goToSkills} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.skillRow}
          >
            {displaySkills.map((skill) => (
              <View key={skill.id} style={styles.skillTile}>
                <SkillCard skill={skill} selected onPress={goToSkills} />
              </View>
            ))}
            {selectedSkills.length === 0 ? (
              <Pressable
                onPress={goToSkills}
                accessibilityRole="button"
                accessibilityLabel="Tap Skills to add your skills"
                style={({ pressed }) => [styles.emptyTile, pressed && styles.pressedSm]}
              >
                <View style={styles.emptyIcon}>
                  <Ionicons name="add" size={26} color={colors.primary} />
                </View>
                <Text style={styles.emptyText}>Tap Skills to add</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </View>

        {/* Nearby opportunities */}
        <View>
          <SectionHeader title="NEARBY OPPORTUNITIES" />
          <View style={styles.oppList}>
            {opportunities.map((opp, i) => (
              <Animated.View key={opp.id} entering={enter.listRow(i)}>
                <OpportunityCard
                  opportunity={opp}
                  onPress={() => router.push(`/job/${opp.id}`)}
                />
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: TAB_CLEARANCE,
    gap: spacing.xl,
  },
  headerBlock: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerText: { flex: 1, gap: 2 },
  greeting: { ...typography.label, color: colors.muted },
  name: { ...typography.h1, color: colors.dark },
  avatarBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedSm: { opacity: 0.7, transform: [{ scale: 0.97 }] },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  liveText: { ...typography.label, color: colors.dark, flex: 1 },
  dotWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotPulse: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },

  skillRow: { gap: spacing.md, paddingRight: spacing.lg },
  skillTile: { width: 116, height: 132 },
  emptyTile: {
    width: 150,
    height: 132,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}0D`,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.primary}1F`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { ...typography.label, color: colors.primary, textAlign: 'center' },

  oppList: { gap: spacing.md },
});
