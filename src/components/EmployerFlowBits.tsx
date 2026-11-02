import React, { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadows, spacing, typography } from '../theme';
import { layoutSoft, usePressScale } from '../theme/motion';
import { skillById, type IconLib, type Worker } from '../data/mockData';
import { AppIcon } from './AppIcon';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Dials the worker, falling back to a readable alert when the device
 * cannot open the phone app (e.g. simulator without a dialer).
 */
export function callWorker(worker: Pick<Worker, 'name' | 'phone'>) {
  const tel = `tel:${worker.phone.replace(/\s+/g, '')}`;
  const fallback = () => Alert.alert(`Call ${worker.name} at ${worker.phone}`);
  try {
    const request = Linking.openURL(tel);
    request.catch(fallback);
  } catch {
    fallback();
  }
}

type CardProps = {
  worker: Worker;
  onView: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  /** Stagger index for the entrance animation. */
  index?: number;
};

/**
 * Employer-side worker result card: avatar, availability, skill chips and
 * two prominent actions — View Profile (outline) and Call (filled).
 * Optional inline save toggle used by both Search and Saved lists.
 */
export function EmployerWorkerCard({ worker, onView, saved = false, onToggleSave, index = 0 }: CardProps) {
  const savePress = usePressScale('control');

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 5) * 60).duration(300)}
      layout={layoutSoft}
      style={[styles.card, shadows.card, !worker.available && styles.cardBusy]}
    >
      <View style={styles.cardTop}>
        <Avatar name={worker.name} color={worker.avatarColor} size="md" online={worker.available} />
        <View style={styles.identity}>
          <Text style={styles.cardName} numberOfLines={1} accessibilityRole="header">
            {worker.name}
          </Text>
          <Text style={styles.cardMeta} numberOfLines={1}>
            {worker.yearsExperience} yrs experience · {worker.distanceKm.toFixed(1)} km
          </Text>
        </View>
        {onToggleSave ? (
          <AnimatedPressable
            onPress={onToggleSave}
            onPressIn={savePress.onPressIn}
            onPressOut={savePress.onPressOut}
            accessibilityRole="button"
            accessibilityState={{ selected: saved }}
            accessibilityLabel={saved ? `Remove ${worker.name} from saved workers` : `Save ${worker.name}`}
            style={[styles.saveBtn, savePress.style]}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={saved ? colors.primary : colors.muted}
            />
          </AnimatedPressable>
        ) : null}
      </View>

      <View style={styles.badgeRow}>
        <StatusBadge
          label={worker.available ? 'AVAILABLE' : 'BUSY'}
          variant={worker.available ? 'success' : 'muted'}
        />
        {worker.skills.map((id) => {
          const skill = skillById(id);
          if (!skill) return null;
          return (
            <View key={id} style={[styles.chip, { backgroundColor: `${skill.color}14` }]}>
              <AppIcon lib={skill.icon.lib} name={skill.icon.name} size={14} color={skill.color} />
              <Text style={[styles.chipText, { color: skill.color }]} numberOfLines={1}>
                {skill.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.cardActions}>
        <SecondaryButton label="View Profile" onPress={onView} style={styles.actionBtn} />
        <PrimaryButton
          label="Call"
          onPress={() => callWorker(worker)}
          icon={<Ionicons name="call" size={17} color={colors.white} />}
          style={styles.actionBtn}
        />
      </View>
    </Animated.View>
  );
}

type EmptyStateProps = {
  icon: { lib: IconLib; name: string };
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Centered empty state: tinted icon, copy, and an optional primary action. */
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.empty}>
      <View style={styles.emptyIcon}>
        <AppIcon lib={icon.lib} name={icon.name} size={40} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle} accessibilityRole="header">
        {title}
      </Text>
      {message ? <Text style={styles.emptyMsg}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.emptyBtn} />
      ) : null}
    </Animated.View>
  );
}

/** Tiny muted honesty note shown under sample lists. */
export function SampleCaption({ text = 'Sample data for demonstration.' }: { text?: string }) {
  return <Text style={styles.sampleNote}>{text}</Text>;
}

/**
 * Light status-bar content, mounted ONLY while a dark-hero screen is focused.
 * Conditional mounting keeps the shared root `<StatusBar style="dark" />`
 * authoritative everywhere else (multiple always-mounted status bars would
 * otherwise fight over mount order when tabs stay mounted).
 */
export function HeroStatusBar() {
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, [])
  );

  if (!focused) return null;
  return <StatusBar style="light" />;
}

type MarkProps = {
  size?: number;
  /** Renders on a dark surface (transparent fill, light border). */
  dark?: boolean;
  /** When provided, shows these initials instead of the factory mark. */
  initials?: string;
};

/** Employer brand mark — factory icon (or initials) inside a circular badge. */
export function EmployerMark({ size = 52, dark = false, initials }: MarkProps) {
  const glyph = Math.round(size * (initials ? 0.36 : 0.48));
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={initials ? `Employer initials ${initials}` : 'Employer mark'}
      style={[
        styles.mark,
        { width: size, height: size, borderRadius: size / 2 },
        dark ? styles.markDark : styles.markLight,
      ]}
    >
      {initials ? (
        <Text style={[styles.markText, { fontSize: glyph }]}>{initials}</Text>
      ) : (
        <AppIcon lib="MaterialCommunityIcons" name="factory" size={glyph} color={colors.white} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Worker card -------------------------------------------------------
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardBusy: { opacity: 0.78 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  identity: { flex: 1, gap: 2 },
  cardName: { ...typography.h3, fontSize: 17, color: colors.dark },
  cardMeta: { ...typography.caption, color: colors.muted },
  saveBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  chipText: { ...typography.caption, fontWeight: '800', fontSize: 12 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  actionBtn: { flex: 1, paddingHorizontal: spacing.md, minHeight: 52 },

  // --- Empty state -------------------------------------------------------
  empty: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl, paddingHorizontal: spacing.lg },
  emptyIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { ...typography.h2, fontSize: 21, color: colors.dark, textAlign: 'center' },
  emptyMsg: { ...typography.body, color: colors.muted, textAlign: 'center' },
  emptyBtn: { marginTop: spacing.sm, paddingHorizontal: spacing.xxl },

  // --- Caption -----------------------------------------------------------
  sampleNote: {
    ...typography.caption,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },

  // --- Employer mark -----------------------------------------------------
  mark: { alignItems: 'center', justifyContent: 'center' },
  markLight: { backgroundColor: colors.primary },
  markDark: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  markText: { ...typography.bodyBold, fontWeight: '800', color: colors.white, letterSpacing: 1 },
});

export default EmployerWorkerCard;
