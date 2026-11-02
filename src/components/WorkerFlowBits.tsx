import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
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
import { motion, usePressScale } from '../theme/motion';
import { skillById, type Opportunity, type Skill } from '../data/mockData';

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
  const press = usePressScale('control');
  const check = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    check.value = withTiming(selected ? 1 : 0, { duration: motion.duration.base, easing: motion.easing.out });
  }, [selected, check]);

  const checkStyle = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: 0.5 + check.value * 0.5 }],
  }));

  return (
    <Animated.View style={[styles.bigCard, selected && styles.bigCardSelected, shadows.card, press.style]}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
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
      // Opacity-only halo on a slow ≥1200ms cycle; no scaling at all.
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0, { duration: motion.duration.base });
    }
  }, [available, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: available ? pulse.value * 0.45 : 0,
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
/* SkillChip — compact icon + label chip used on the Profile screen.  */
/* ------------------------------------------------------------------ */

type SkillChipProps = {
  skill: Skill;
  onPress?: () => void;
};

export function SkillChip({ skill, onPress }: SkillChipProps) {
  const press = usePressScale('control');

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`${skill.label} skill`}
      style={[styles.chip, { backgroundColor: `${skill.color}14`, borderColor: `${skill.color}59` }, press.style]}
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
  opportunity: Opportunity;
  onPress?: () => void;
};

export function OpportunityCard({ opportunity, onPress }: OpportunityCardProps) {
  const press = usePressScale('card');
  const { factory, role, location, distanceKm, hiring, skillId, skillIds, salaryMin, salaryMax, vacancies, postedAgo } =
    opportunity;

  const skill = skillById(skillId);
  const markColor = skill?.color ?? colors.navy;
  const chipSkills = skillIds
    .map((id) => skillById(id))
    .filter((s): s is Skill => s !== undefined)
    .slice(0, 2);
  const extraSkills = skillIds.length - chipSkills.length;
  const district = location.split(',')[0];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={`${role} at ${factory}, ${location}, ${distanceKm} kilometres away, ₹${salaryMin} to ${salaryMax} per month, ${vacancies} vacancies`}
      style={[styles.oppCard, shadows.card, press.style]}
    >
      {/* Row 1 — mark, title block, hiring badge */}
      <View style={styles.oppTopRow}>
        <View
          style={[styles.oppMark, { backgroundColor: `${markColor}12`, borderColor: `${markColor}40` }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <MaterialCommunityIcons name="factory" size={20} color={colors.navy} />
        </View>

        <View style={styles.oppTitleCol}>
          <Text style={styles.oppTitle} numberOfLines={2}>
            {role.toUpperCase()}
          </Text>
          <Text style={styles.oppCompany} numberOfLines={1}>
            {factory}
          </Text>
        </View>

        <StatusBadge label={hiring ? 'HIRING NOW' : 'NOT HIRING'} variant={hiring ? 'success' : 'muted'} />
      </View>

      {/* Row 2 — location and pay */}
      <View style={styles.oppMetaRow}>
        <View style={styles.oppLocation}>
          <Ionicons name="location" size={14} color={colors.textileBlue} />
          <Text style={styles.oppLocationText} numberOfLines={1}>
            {`${district} · ${distanceKm} km`}
          </Text>
        </View>
        <Text style={styles.oppSalary} numberOfLines={1}>
          {`₹${salaryMin.toLocaleString('en-IN')}–${salaryMax.toLocaleString('en-IN')}`}
        </Text>
      </View>

      {/* Row 3 — required skills */}
      <View style={styles.oppSkillRow}>
        {chipSkills.map((s) => (
          <View
            key={s.id}
            style={[styles.oppMiniChip, { backgroundColor: `${s.color}12`, borderColor: `${s.color}40` }]}
          >
            <AppIcon lib={s.icon.lib} name={s.icon.name} size={12} color={s.color} />
            <Text style={[styles.oppMiniChipText, { color: s.color }]} numberOfLines={1}>
              {s.label}
            </Text>
          </View>
        ))}
        {extraSkills > 0 ? (
          <View style={[styles.oppMiniChip, styles.oppMiniChipMore]}>
            <Text style={[styles.oppMiniChipText, styles.oppMiniChipTextMore]}>+{extraSkills}</Text>
          </View>
        ) : null}
      </View>

      {/* Seam */}
      <View style={styles.oppSeam} />

      {/* Row 4 — footer */}
      <View style={styles.oppFooter}>
        <Text style={styles.oppFooterMeta} numberOfLines={1}>
          {`${vacancies} vacancies · Posted ${postedAgo}`}
        </Text>
        <View style={styles.oppCta}>
          <Text style={styles.oppCtaText}>View opportunity</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  /* BigSkillCard */
  bigCard: {
    minHeight: 180,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bigCardSelected: { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: `${colors.primary}12` },
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
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  chipIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  chipLabel: { ...typography.label, color: colors.dark },

  /* OpportunityCard */
  oppCard: {
    minHeight: 140,
    padding: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  oppTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  oppMark: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppTitleCol: { flex: 1, gap: 2 },
  oppTitle: {
    ...typography.label,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.ink,
  },
  oppCompany: { ...typography.caption, color: colors.muted },
  oppMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  oppLocation: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  oppLocationText: { ...typography.caption, color: colors.muted, flexShrink: 1 },
  oppSalary: {
    ...typography.label,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    flexShrink: 1,
  },
  oppSkillRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  oppMiniChip: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xs,
    borderWidth: 1,
  },
  oppMiniChipMore: { backgroundColor: colors.chipBg, borderColor: colors.border },
  oppMiniChipText: { ...typography.caption, fontSize: 12, fontWeight: '700' },
  oppMiniChipTextMore: { color: colors.muted },
  oppSeam: { height: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: colors.border },
  oppFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  oppFooterMeta: { ...typography.caption, color: colors.muted, flexShrink: 1 },
  oppCta: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  oppCtaText: { ...typography.label, color: colors.primary },
});
