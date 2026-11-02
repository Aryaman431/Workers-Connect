import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import {
  AppIcon,
  GlassSurface,
  Screen,
  SecondaryButton,
  PrimaryButton,
  SectionHeader,
  StatusBadge,
  TextilePattern,
} from '../../components';
import { HeroStatusBar, SampleCaption, callWorker } from '../../components/EmployerFlowBits';
import { colors, glass, radius, shadows, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { skillById, workers } from '../../data/mockData';
import { useAppState } from '../../state/AppContext';

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Worker detail — shared by both modes, pushed on the root stack. */
export default function WorkerDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { savedWorkerIds, toggleSaved } = useAppState();

  const worker = workers.find((w) => w.id === id);
  const saved = worker ? savedWorkerIds.includes(worker.id) : false;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/role');
  };

  if (!worker) {
    return (
      <Screen bg={colors.bg} edges={[]}>
        <View style={[styles.notFound, { paddingTop: insets.top + spacing.xxxl }]}>
          <View style={styles.notFoundIcon}>
            <Ionicons name="person-outline" size={44} color={colors.muted} />
          </View>
          <Text style={styles.notFoundTitle} accessibilityRole="header">
            Worker not found
          </Text>
          <Text style={styles.notFoundMsg}>This profile is not available right now.</Text>
          <SecondaryButton label="Go back" onPress={goBack} style={styles.notFoundBtn} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen bg={colors.bg} edges={[]}>
      <HeroStatusBar />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Gradient hero */}
        <Animated.View entering={enter.fadeUp()}>
          <LinearGradient
            colors={[colors.navy, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}
          >
            <TextilePattern color={colors.white} opacity={0.08} count={14} />

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
            </View>

            <View style={styles.heroBody}>
              <Animated.View entering={enter.fadeUp()}>
                <View style={styles.heroAvatar}>
                  <Text style={styles.heroInitials}>{initialsOf(worker.name)}</Text>
                </View>
              </Animated.View>

              <Text style={styles.heroName} accessibilityRole="header">
                {worker.name}
              </Text>

              <View style={styles.badgeRow}>
                <StatusBadge
                  label={worker.available ? 'AVAILABLE' : 'BUSY'}
                  variant={worker.available ? 'success' : 'muted'}
                />
                {worker.profileComplete ? (
                  <StatusBadge label="PROFILE COMPLETE" variant="success" />
                ) : null}
              </View>

              <View style={styles.chipRow}>
                <View style={styles.heroChip}>
                  <Ionicons name="navigate-outline" size={14} color={colors.white} />
                  <Text style={styles.heroChipText}>{worker.distanceKm.toFixed(1)} km away</Text>
                </View>
                <View style={styles.heroChip}>
                  <Ionicons name="location-outline" size={14} color={colors.white} />
                  <Text style={styles.heroChipText}>{worker.location}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Skills */}
        <Animated.View entering={enter.fadeUp(120)} style={styles.section}>
          <SectionHeader title="Skills" />
          <View style={styles.skillGrid}>
            {worker.skills.map((skillId) => {
              const skill = skillById(skillId);
              if (!skill) return null;
              return (
                <View
                  key={skillId}
                  style={[
                    styles.skillCell,
                    { backgroundColor: `${skill.color}12`, borderColor: `${skill.color}33` },
                  ]}
                >
                  <View style={[styles.skillIcon, { backgroundColor: `${skill.color}1F` }]}>
                    <AppIcon lib={skill.icon.lib} name={skill.icon.name} size={24} color={skill.color} />
                  </View>
                  <Text style={styles.skillLabel} numberOfLines={2}>
                    {skill.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Info grid */}
        <Animated.View entering={enter.fadeUp(200)} style={styles.section}>
          <SectionHeader title="About this worker" />
          <View style={styles.infoGrid}>
            <View style={styles.infoCell}>
              <View style={styles.infoHead}>
                <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
                <Text style={styles.infoLabel}>Experience</Text>
              </View>
              <Text style={styles.infoValue}>{worker.yearsExperience} years</Text>
            </View>

            <View style={styles.infoCell}>
              <View style={styles.infoHead}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <Text style={styles.infoLabel}>Location</Text>
              </View>
              <Text style={styles.infoValue}>{worker.location}</Text>
            </View>

            <View style={styles.infoCell}>
              <View style={styles.infoHead}>
                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                <Text style={styles.infoLabel}>Available today</Text>
              </View>
              <View
                style={[
                  styles.availPill,
                  { backgroundColor: worker.available ? colors.successSoft : colors.chipBg },
                ]}
              >
                <View
                  style={[styles.availDot, { backgroundColor: worker.available ? colors.success : colors.muted }]}
                />
                <Text
                  style={[styles.availText, { color: worker.available ? colors.success : colors.muted }]}
                >
                  {worker.availableToday}
                </Text>
              </View>
            </View>

            <View style={styles.infoCell}>
              <View style={styles.infoHead}>
                <Ionicons name="business-outline" size={16} color={colors.primary} />
                <Text style={styles.infoLabel}>Preferred work</Text>
              </View>
              <Text style={styles.infoValue}>{worker.preferredWork}</Text>
            </View>
          </View>

          <SampleCaption text="Sample profile for demonstration." />
        </Animated.View>
      </ScrollView>

      {/* Sticky call / save bar */}
      <GlassSurface
        tone="light"
        emphasis="strong"
        intensity={glass.intensityHigh}
        style={[styles.ctaBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + spacing.sm : spacing.lg }]}
      >
        <PrimaryButton
          label="CALL WORKER"
          onPress={() => callWorker(worker)}
          icon={<Ionicons name="call" size={20} color={colors.white} />}
          style={styles.callAction}
        />
        <Animated.View
          key={saved ? 'saved' : 'save'}
          entering={enter.fade()}
          style={styles.saveWrap}
        >
          <SecondaryButton
            label={saved ? 'SAVED' : 'SAVE'}
            onPress={() => toggleSaved(worker.id)}
            icon={
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={colors.primary}
              />
            }
            style={styles.saveInner}
          />
        </Animated.View>
      </GlassSurface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
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
  heroBody: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm },
  heroAvatar: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInitials: { ...typography.display, fontSize: 42, lineHeight: 48, color: colors.white },
  heroName: { ...typography.h1, color: colors.white, textAlign: 'center', marginTop: spacing.xs },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  heroChipText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  skillCell: {
    width: '48%',
    minHeight: 96,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  skillIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillLabel: { ...typography.label, color: colors.dark, textAlign: 'center' },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  infoCell: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  infoHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  infoLabel: { ...typography.caption, color: colors.muted },
  infoValue: { ...typography.bodyBold, fontSize: 15, color: colors.dark },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  availDot: { width: 8, height: 8, borderRadius: 4 },
  availText: { ...typography.caption, fontWeight: '800' },
  ctaBar: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    ...shadows.elevated,
  },
  callAction: { flex: 1.6, paddingHorizontal: spacing.md, minHeight: 56 },
  saveWrap: { flex: 1 },
  saveInner: { width: '100%', minHeight: 56, paddingHorizontal: spacing.md },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.md },
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
