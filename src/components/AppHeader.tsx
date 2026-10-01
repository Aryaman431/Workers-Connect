import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors, radius, spacing, typography } from '../theme';

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
};

/** In-app header with optional back button and right-hand slot. */
export function AppHeader({ title, showBack = false, onBack, right, subtitle, dark = false }: Props) {
  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: dark ? colors.darkSurface : colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={dark ? colors.white : colors.dark} />
        </Pressable>
      ) : (
        <View style={styles.backBtn} />
      )}

      <View style={styles.titleWrap}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: dark ? colors.white : colors.dark }]}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: dark ? colors.darkMuted : colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { ...typography.h3, textAlign: 'center' },
  subtitle: { ...typography.caption, marginTop: 2, textAlign: 'center' },
  right: { minWidth: 44, alignItems: 'flex-end' },
});

export default AppHeader;
