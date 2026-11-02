import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import {
  GlassSurface,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionHeader,
  TextilePattern,
  ThreadDivider,
} from '../../components';
import { EmployerMark, HeroStatusBar, callWorker } from '../../components/EmployerFlowBits';
import { SkillChip } from '../../components/WorkerFlowBits';
import { colors, glass, radius, shadows, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { jobById, skillById } from '../../data/mockData';

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Compact fact cell shown in the key-facts grid below the hero. */
type Fact = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

/** Job detail — pushed from the worker home list on the root stack. */
export default function JobDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = jobById(id);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/role');
  };

  if (!job) {
    return (
      <Screen bg={colors.bg} edges={[]}>
        <View style={[styles.notFound, { paddingTop: insets.top + spacing.xxxl }]}>
          <View style={styles.notFoundIcon}>
            <Ionicons name="briefcase-outline" size={44} color={colors.muted} />
          </View>
          <Text style={styles.notFoundTitle} accessibilityRole="header">
            Job not found
          </Text>
          <Text style={styles.notFoundMsg}>This job is not available right now.</Text>
          <SecondaryButton label="Go back" onPress={goBack} style={styles.notFoundBtn} />
        </View>
      </Screen>
    );
  }

  const payText = `₹${job.salaryMin.toLocaleString('en-IN')}–${job.salaryMax.toLocaleString('en-IN')}`;

  const facts: Fact[] = [
    { key: 'type', icon: 'briefcase-outline', label: 'Employment type', value: job.employmentType },
    { key: 'experience', icon: 'hourglass-outline', label: 'Experience', value: job.experience },
    { key: 'vacancies', icon: 'people-outline', label: 'Vacancies', value: `${job.vacancies} openings` },
    { key: 'hours', icon: 'time-outline', label: 'Working hours', value: job.workingHours },
    { key: 'shift', icon: 'swap-horizontal-outline', label: 'Shift', value: job.shift },
    { key: 'distance', icon: 'location-outline', label: 'Distance', value: `${job.distanceKm} km away` },
  ];

  return (
    <Screen bg={colors.bg} edges={[]}>
      <HeroStatusBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Gradient hero — the job headline lives here. */}
        <Animated.View entering={enter.fadeUp()}>
          <LinearGradient
            colors={[colors.navy, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
          >
            <TextilePattern color={colors.white} opacity={0.07} count={14} />

            <View style={styles.heroTop}>
              <Pressable
                onPress={goBack}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={8}
                style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name="chevron-back" size={22} color={colors.white} />
              </Pressable>
              {job.factory ? <EmployerMark size={44} dark /> : null}
            </View>

            <View style={styles.heroBody}>
              <Text style={styles.heroKicker}>{job.hiring ? 'HIRING NOW' : 'OPEN POSITION'}</Text>
              <Text style={styles.heroTitle} accessibilityRole="header">
                {job.role.toUpperCase()}
              </Text>
              <Text style={styles.heroFactory}>{job.factory}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="pin-outline"
                    size={14}
                    color="rgba(255,255,255,0.75)"
                    importantForAccessibility="no"
                  />
                  <Text style={styles.metaText}>{`${job.location} · ${job.distanceKm} km`}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color="rgba(255,255,255,0.75)"
                    importantForAccessibility="no"
                  />
                  <Text style={styles.metaText}>Posted {job.postedAgo}</Text>
                </View>
              </View>
            </View>

            {/* Salary pinned to the hero bottom on a glass sheet. */}
            <GlassSurface
              tone="light"
              emphasis="strong"
              style={{ borderRadius: radius.md, alignSelf: 'center', marginTop: spacing.lg }}
            >
              <View style={styles.heroPayInner}>
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color={colors.primaryDark}
                  importantForAccessibility="no"
                />
                <View style={styles.heroPayText}>
                  <Text style={styles.heroPayValue}>{payText}</Text>
                  <Text style={styles.heroPayPeriod}>/ month</Text>
                </View>
              </View>
            </GlassSurface>
          </LinearGradient>
        </Animated.View>

        {/* Key facts */}
        <Animated.View entering={enter.fadeUp(60)} style={styles.facts}>
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Salary, ${job.salaryMin.toLocaleString('en-IN')} to ${job.salaryMax.toLocaleString(
              'en-IN'
            )} rupees per month`}
            style={styles.salaryCard}
          >
            <View style={styles.factHead}>
              <Ionicons name="cash-outline" size={18} color={colors.textileBlue} importantForAccessibility="no" />
              <Text style={styles.salaryKicker}>SALARY</Text>
            </View>
            <View style={styles.salaryRow}>
              <Text style={styles.salaryValue}>{payText}</Text>
              <Text style={styles.salaryPeriod}>/ month</Text>
            </View>
          </View>

          <View style={styles.factGrid}>
            {facts.map((fact) => (
              <View
                key={fact.key}
                accessible
                accessibilityRole="text"
                accessibilityLabel={`${fact.label}, ${fact.value}`}
                style={styles.factCell}
              >
                <View style={styles.factHead}>
                  <Ionicons name={fact.icon} size={18} color={colors.textileBlue} importantForAccessibility="no" />
                  <Text style={styles.factLabel}>{fact.label}</Text>
                </View>
                <Text style={styles.factValue}>{fact.value}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Skills */}
        <Animated.View entering={enter.fadeUp(120)} style={styles.section}>
          <SectionHeader title="SKILLS YOU NEED" />
          <View style={styles.chipWrap}>
            {job.skillIds.map((skillId) => {
              const skill = skillById(skillId);
              if (!skill) return null;
              return <SkillChip key={skillId} skill={skill} />;
            })}
          </View>
        </Animated.View>

        {/* Description + responsibilities */}
        <Animated.View entering={enter.fadeUp(160)} style={styles.section}>
          <SectionHeader title="ABOUT THIS JOB" />
          <Text style={styles.body}>{job.description}</Text>

          <ThreadDivider style={styles.divider} />

          <SectionHeader title="YOUR WORK" />
          {job.responsibilities.map((duty) => (
            <View key={duty} style={styles.dutyRow}>
              <View style={styles.dutyKnot} importantForAccessibility="no" />
              <Text style={styles.dutyText}>{duty}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Contact */}
        <Animated.View entering={enter.fadeUp(200)} style={styles.section}>
          <SectionHeader title="CONTACT PERSON" />
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Contact ${job.contact.name}, ${job.contact.role}, ${job.contact.phone}`}
            style={styles.contactCard}
          >
            <View style={styles.contactAvatar} importantForAccessibility="no">
              <Text style={styles.contactInitials}>{initialsOf(job.contact.name)}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{job.contact.name}</Text>
              <Text style={styles.contactRole}>{job.contact.role}</Text>
              <Text style={styles.contactPhone}>{job.contact.phone}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky call / apply bar */}
      <GlassSurface
        tone="light"
        emphasis="strong"
        intensity={glass.intensityHigh}
        style={[
          styles.ctaBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + spacing.sm : spacing.lg },
        ]}
      >
        <PrimaryButton
          label="CALL NOW"
          onPress={() => callWorker({ name: job.contact.name, phone: job.contact.phone })}
          icon={<Ionicons name="call" size={20} color={colors.white} />}
          style={styles.callAction}
        />
        <SecondaryButton
          label="APPLY"
          onPress={() => Alert.alert('Application sent', `${job.contact.name} will call you back.`)}
          style={styles.applyAction}
        />
      </GlassSurface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },

  /* Hero */
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroBody: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  heroKicker: {
    ...typography.kicker,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  heroTitle: {
    ...typography.h1,
    letterSpacing: 0.6,
    color: colors.white,
    textAlign: 'center',
  },
  heroFactory: {
    ...typography.h3,
    fontSize: 17,
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  heroPayInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  heroPayText: { gap: 0 },
  heroPayValue: { ...typography.stat, color: colors.ink },
  heroPayPeriod: { ...typography.caption, color: colors.muted },

  /* Key facts */
  facts: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.md },
  salaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  salaryKicker: { ...typography.kicker, color: colors.muted },
  salaryRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: spacing.xs },
  salaryValue: { ...typography.h2, color: colors.ink },
  salaryPeriod: { ...typography.caption, color: colors.muted },
  factGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  factCell: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  factHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  factLabel: { ...typography.caption, color: colors.muted, flexShrink: 1 },
  factValue: { ...typography.stat, fontSize: 17, lineHeight: 22, color: colors.ink },

  /* Body sections */
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  body: { ...typography.body, color: colors.dark },
  divider: { marginVertical: spacing.lg },
  dutyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, minHeight: 40 },
  dutyKnot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.textileBlue,
    transform: [{ rotate: '45deg' }],
    marginTop: 8,
  },
  dutyText: { ...typography.body, color: colors.dark, flex: 1 },

  /* Contact */
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitials: { ...typography.stat, color: colors.white },
  contactInfo: { flex: 1, gap: 2 },
  contactName: { ...typography.bodyBold, color: colors.ink },
  contactRole: { ...typography.caption, color: colors.muted },
  contactPhone: { ...typography.label, color: colors.primaryDark },

  /* Sticky actions */
  ctaBar: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    ...shadows.elevated,
  },
  callAction: { flex: 1.6, paddingHorizontal: spacing.md, minHeight: 56 },
  applyAction: { flex: 1, paddingHorizontal: spacing.md, minHeight: 56 },

  /* Not found */
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  notFoundIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  notFoundTitle: { ...typography.h2, fontSize: 21, color: colors.dark, textAlign: 'center' },
  notFoundMsg: { ...typography.body, color: colors.muted, textAlign: 'center' },
  notFoundBtn: { marginTop: spacing.sm, paddingHorizontal: spacing.xxl },
});
