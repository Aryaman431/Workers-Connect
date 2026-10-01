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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/*
 * The press-scale handlers below mutate reanimated shared values — the same
 * pattern used by every foundation component (PrimaryButton, SkillCard, ...).
 * `react-hooks/immutability` false-positives on it, so it is disabled here.
 */
 

import { AppIcon } from './AppIcon';
import { StatusBadge } from './StatusBadge';
import { colors, iconSizes, radius, shadows, spacing, typography } from '../theme';
import type { Skill } from '../data/mockData';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/* ------------------------------------------------------------------ */
/* BigSkillCard — large 2-column grid tile used on the Skills screen. */
/* ------------------------------------------------------------------ */

type BigSkillCardProps = {
  skill: Skill;
  selected?: boolean;
  onPress?: () => void;
};

export function BigSkillCard({ skill, selected = false, onPress }: BigSkillCardProps) {
  const scale = useSharedValue(1);
  const check = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    check.value = withSpring(selected ? 1 : 0, { damping: 13, stiffness: 260 });
  }, [selected, check]);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: 0.5 + check.value * 0.5 }],
  }));

  return (
    <Animated.View style={[styles.bigCard, selected && styles.bigCardSelected, shadows.card, cardStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 18, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 240 });
        }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={`${skill.label}${selected ? ', selected' : ''}`}
        style={styles.bigPressable}
      >
        <Animated.View style={[styles.bigCheck, checkStyle]} pointerEvents="none">
          <Ionicons name="checkmark" size={16} color={colors.white} />
        </Animated.View>

        <View style={[styles.bigIconBox, { backgroundColor: `${skill.color}1F`, borderColor: `${skill.color}59` }]}>
          <AppIcon lib={skill.icon.lib} name={skill.icon.name} size={iconSizes.hero} color={skill.color} />
        </View>

        <View style={styles.bigLabelWrap}>
          <Text style={[styles.bigLabel, selected && styles.bigLabelSelected]} numberOfLines={2}>
            {skill.label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/* AvailabilityRing — large pulsing circular status indicator.        */
/* ------------------------------------------------------------------ */

type AvailabilityRingProps = {
  available: boolean;
  size?: number;
};

export function AvailabilityRing({ available, size = 156 }: AvailabilityRingProps) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (available) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0, { duration: 250 });
    }
  }, [available, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: available ? 0.4 * (1 - pulse.value) : 0,
    transform: [{ scale: 1 + pulse.value * 0.14 }],
  }));

  const ringBg = available ? colors.successSoft : colors.chipBg;
  const ringFg = available ? colors.success : colors.muted;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={available ? 'You are available for work' : 'You are not available'}
      style={styles.ringWrap}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.ringPulse, { width: size, height: size, borderRadius: size / 2 }, pulseStyle]}
      />
      <View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: ringFg, backgroundColor: ringBg },
        ]}
      >
        <Ionicons name={available ? 'checkmark' : 'pause'} size={size * 0.3} color={ringFg} />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* SkillChip — compact icon + label pill used on the Profile screen.  */
/* ------------------------------------------------------------------ */

type SkillChipProps = {
  skill: Skill;
  onPress?: () => void;
};

export function SkillChip({ skill, onPress }: SkillChipProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 240 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${skill.label} skill`}
      style={[styles.chip, { backgroundColor: `${skill.color}14`, borderColor: `${skill.color}59` }, animStyle]}
    >
      <View style={[styles.chipIcon, { backgroundColor: `${skill.color}29` }]}>
        <AppIcon lib={skill.icon.lib} name={skill.icon.name} size={16} color={skill.color} />
      </View>
      <Text style={styles.chipLabel} numberOfLines={1}>
        {skill.label}
      </Text>
    </AnimatedPressable>
  );
}

/* ------------------------------------------------------------------ */
/* OpportunityCard — nearby job card used on the worker home screen.  */
/* ------------------------------------------------------------------ */

type OpportunityCardProps = {
  factory: string;
  role: string;
  distanceKm: number;
  hiring: boolean;
  onPress?: () => void;
};

export function OpportunityCard({ factory, role, distanceKm, hiring, onPress }: OpportunityCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 260 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${factory}, ${role}, ${distanceKm} kilometres away${hiring ? ', hiring now' : ''}`}
      style={[styles.oppCard, shadows.card, animStyle]}
    >
      <View style={styles.oppIconBox}>
        <MaterialCommunityIcons name="factory" size={26} color={colors.navy} />
      </View>

      <View style={styles.oppBody}>
        <Text style={styles.oppFactory} numberOfLines={1}>
          {factory}
        </Text>
        <Text style={styles.oppRole} numberOfLines={1}>
          {role}
        </Text>
        <View style={styles.oppMetaRow}>
          <View style={styles.oppDistance}>
            <Ionicons name="location" size={12} color={colors.muted} />
            <Text style={styles.oppDistanceText}>{distanceKm} km</Text>
          </View>
          <StatusBadge label={hiring ? 'HIRING NOW' : 'NOT HIRING'} variant={hiring ? 'success' : 'muted'} />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  /* BigSkillCard */
  bigCard: {
    minHeight: 180,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  bigCardSelected: { borderColor: colors.primary, backgroundColor: `${colors.primary}12` },
  bigPressable: {
    flex: 1,
    minHeight: 176,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  bigCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bigIconBox: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigLabelWrap: { height: 48, justifyContent: 'center', width: '100%' },
  bigLabel: { ...typography.bodyBold, color: colors.dark, textAlign: 'center' },
  bigLabelSelected: { color: colors.primaryDark },

  /* AvailabilityRing */
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ringPulse: { position: 'absolute', borderWidth: 6, borderColor: colors.success },
  ring: { alignItems: 'center', justifyContent: 'center', borderWidth: 6 },

  /* SkillChip */
  chip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  chipLabel: { ...typography.label, color: colors.dark },

  /* OpportunityCard */
  oppCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    minHeight: 92,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  oppIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: `${colors.navy}14`,
    borderWidth: 1,
    borderColor: `${colors.navy}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppBody: { flex: 1, gap: 2 },
  oppFactory: { ...typography.bodyBold, color: colors.dark },
  oppRole: { ...typography.label, color: colors.muted },
  oppMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  oppDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.chipBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  oppDistanceText: { ...typography.caption, color: colors.muted, fontWeight: '700' },
});
