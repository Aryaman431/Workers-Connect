import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
  light?: boolean;
};

/** Section title with an optional trailing action. */
export function SectionHeader({ title, action, onAction, light = false }: Props) {
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: light ? colors.white : colors.dark }]} accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={action}
          hitSlop={8}
          style={({ pressed }) => [styles.action, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
    minHeight: 32,
  },
  title: { ...typography.h3, flexShrink: 1 },
  action: { minHeight: 48, justifyContent: 'center', paddingHorizontal: spacing.xs },
  actionText: { ...typography.label, color: colors.primary, fontWeight: '800' },
});

export default SectionHeader;
