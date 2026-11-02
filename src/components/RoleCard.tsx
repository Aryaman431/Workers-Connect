import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { absoluteFill, colors, radius, shadows, spacing, typography } from '../theme';
import { motion, usePressScale } from '../theme/motion';
import { AppIcon } from './AppIcon';
import type { IconLib } from '../data/mockData';

type Props = {
  role: 'worker' | 'employer';
  title: string;
  subtitle: string;
  primaryIcon: { lib: IconLib; name: string };
  secondaryIcon?: { lib: IconLib; name: string };
  selected?: boolean;
  onPress?: () => void;
};

/** Large (min 180px) role-selection card with a selection animation. */
export function RoleCard({ role, title, subtitle, primaryIcon, secondaryIcon, selected = false, onPress }: Props) {
  const press = usePressScale('card');
  const selection = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    selection.value = withTiming(selected ? 1 : 0, {
      duration: motion.duration.base,
      easing: motion.easing.out,
    });
  }, [selected, selection]);

  const ringStyle = useAnimatedStyle(() => ({ opacity: selection.value }));

  const dark = role === 'worker';

  return (
    <Animated.View style={[styles.wrap, press.style]}>
      <Pressable
        onPress={onPress}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${subtitle}`}
        accessibilityState={{ selected }}
        style={[styles.card, dark ? styles.cardDark : styles.cardLight, shadows.card, selected && (dark ? styles.selectedDark : styles.selectedLight)]}
      >
        <Animated.View style={[styles.selectedRing, dark && styles.selectedRingDark, ringStyle]} pointerEvents="none" />

        <View style={[styles.iconRow, dark ? null : styles.iconRowLight]}>
          <View style={[styles.iconBox, dark ? styles.iconBoxDark : styles.iconBoxLight]}>
            <AppIcon lib={primaryIcon.lib} name={primaryIcon.name} size={30} color={dark ? colors.white : colors.navy} />
          </View>
          {secondaryIcon ? (
            <View style={[styles.iconBoxSmall, dark ? styles.iconBoxDark : styles.iconBoxLight]}>
              <AppIcon lib={secondaryIcon.lib} name={secondaryIcon.name} size={20} color={dark ? colors.accent : colors.primary} />
            </View>
          ) : null}
        </View>

        <Text style={[styles.title, dark && styles.textWhite]} accessibilityRole="header">
          {title}
        </Text>
        <Text style={[styles.subtitle, dark && styles.textMuted]}>{subtitle}</Text>

        <View style={[styles.cta, dark && styles.ctaDark]}>
          <Text style={[styles.ctaText, dark && styles.textWhite]}>Continue</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  card: {
    minHeight: 180,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.sm,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardDark: { backgroundColor: colors.navy, borderColor: colors.navy },
  cardLight: { backgroundColor: colors.surface, borderColor: colors.primary },
  selectedDark: { borderColor: colors.accent, borderWidth: 1.5 },
  selectedLight: { borderColor: colors.accent, borderWidth: 1.5, backgroundColor: colors.accentSoft },
  selectedRing: { ...absoluteFill, borderWidth: 3, borderColor: 'transparent', borderRadius: radius.md },
  selectedRingDark: { borderColor: colors.accent },
  iconRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.sm },
  iconRowLight: {},
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDark: { backgroundColor: colors.darkSurface },
  iconBoxLight: { backgroundColor: colors.chipBg },
  iconBoxSmall: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
  },
  title: { ...typography.h2, color: colors.dark },
  subtitle: { ...typography.body, color: colors.muted, marginBottom: spacing.xs },
  textWhite: { color: colors.white },
  textMuted: { color: colors.darkMuted },
  cta: {
    alignSelf: 'flex-start',
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  ctaDark: { backgroundColor: colors.accent },
  ctaText: { ...typography.label, color: colors.white, fontWeight: '800' },
});

export default RoleCard;
