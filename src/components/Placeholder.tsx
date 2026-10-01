import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Screen } from './Screen';
import { AppHeader } from './AppHeader';
import { SecondaryButton } from './SecondaryButton';
import { TextilePattern } from './TextilePattern';
import { colors, radius, spacing, typography } from '../theme';

type Props = {
  /** Route/screen name shown in the placeholder. */
  title: string;
  description?: string;
  showBack?: boolean;
};

/** Minimal placeholder screen — replaced by the owning agent in a later pass. */
export function Placeholder({ title, description, showBack = false }: Props) {
  return (
    <Screen bg={colors.bg}>
      <TextilePattern color={colors.navy} opacity={0.05} count={10} />
      <AppHeader title={title} showBack={showBack} />
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Ionicons name="construct-outline" size={34} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description ?? 'This screen is coming next.'}</Text>
        {showBack ? (
          <SecondaryButton
            label="Go back"
            onPress={() => {
              if (router.canGoBack()) router.back();
            }}
            style={styles.back}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { ...typography.h2, color: colors.dark, textAlign: 'center' },
  desc: { ...typography.body, color: colors.muted, textAlign: 'center', maxWidth: 300 },
  back: { marginTop: spacing.lg, minWidth: 200 },
});

export default Placeholder;
