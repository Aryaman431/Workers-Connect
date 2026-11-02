import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadows, spacing, typography } from '../theme';
import { usePressScale } from '../theme/motion';
import { skillById, type Worker } from '../data/mockData';
import { AppIcon } from './AppIcon';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';

type Props = {
  worker: Worker;
  onPressView?: () => void;
  compact?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Worker result card — avatar, skills, distance, availability and quick actions. */
export function WorkerCard({ worker, onPressView, compact = false }: Props) {
  const callPress = usePressScale('button');

  const call = () => {
    const tel = `tel:${worker.phone.replace(/\s+/g, '')}`;
    Linking.openURL(tel).catch(() => undefined);
  };

  return (
    <View style={[styles.card, shadows.card, compact && styles.cardCompact]}>
      <View style={styles.topRow}>
        <Avatar name={worker.name} color={worker.avatarColor} size={compact ? 'sm' : 'md'} online={worker.available} />
        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1} accessibilityRole="header">
            {worker.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {worker.yearsExperience} yrs · {worker.distanceKm.toFixed(1)} km · {worker.location}
          </Text>
        </View>
        <StatusBadge
          label={worker.available ? 'AVAILABLE' : 'BUSY'}
          variant={worker.available ? 'success' : 'muted'}
        />
      </View>

      {!compact && (
        <View style={styles.skillRow}>
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
      )}

      <View style={styles.actions}>
        <Pressable
          onPress={onPressView}
          accessibilityRole="button"
          accessibilityLabel={`View profile of ${worker.name}`}
          style={({ pressed }) => [styles.viewBtn, pressed && styles.pressed]}
        >
          <Text style={styles.viewText}>View Profile</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>

        <AnimatedPressable
          onPress={call}
          onPressIn={callPress.onPressIn}
          onPressOut={callPress.onPressOut}
          accessibilityRole="button"
          accessibilityLabel={`Call ${worker.name}`}
          style={[styles.callBtn, callPress.style]}
        >
          <Ionicons name="call" size={16} color={colors.white} />
          <Text style={styles.callText}>Call</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardCompact: { padding: spacing.md, gap: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  identity: { flex: 1, gap: 2 },
  name: { ...typography.h3, fontSize: 17, color: colors.dark },
  meta: { ...typography.caption, color: colors.muted },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  chipText: { ...typography.caption, fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  viewBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
  },
  viewText: { ...typography.label, color: colors.primary, fontWeight: '700' },
  callBtn: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  callText: { ...typography.label, color: colors.white, fontWeight: '800' },
  pressed: { opacity: 0.75 },
});

export default WorkerCard;
