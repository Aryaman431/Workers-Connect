import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';

type Props = {
  name: string;
  avatarColor?: string;
  available?: boolean;
  subtitle?: string;
  onEdit?: () => void;
};

/** Large profile header: avatar, name, availability badge, edit affordance. */
export function ProfileHeader({ name, avatarColor = colors.primary, available = true, subtitle, onEdit }: Props) {
  return (
    <View style={styles.wrap}>
      <Avatar name={name} color={avatarColor} size="xl" online={available} />
      <Text style={styles.name} accessibilityRole="header">
        {name}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <StatusBadge label={available ? 'AVAILABLE FOR WORK' : 'NOT AVAILABLE'} variant={available ? 'success' : 'muted'} />
      {onEdit ? (
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          hitSlop={8}
          style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.editText}>Edit profile</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  name: { ...typography.h1, color: colors.dark, marginTop: spacing.xs },
  subtitle: { ...typography.body, color: colors.muted },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.chipBg,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  editText: { ...typography.label, color: colors.primary, fontWeight: '700' },
});

export default ProfileHeader;
