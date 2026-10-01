import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadows, spacing, typography } from '../theme';
import type { Skill } from '../data/mockData';
import { AppIcon } from './AppIcon';

type Props = {
  skill: Skill;
  selected?: boolean;
  onPress?: () => void;
};

/** Tappable skill tile for selection grids — minimum 104px tall. */
export function SkillCard({ skill, selected = false, onPress }: Props) {
  const scale = useSharedValue(1);
  const check = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    check.value = withTiming(selected ? 1 : 0, { duration: 220 });
  }, [selected, check]);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: 0.6 + check.value * 0.4 }],
  }));

  return (
    <Animated.View style={[styles.card, selected && styles.cardSelected, shadows.card, cardStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 18, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 240 });
        }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={`${skill.label}${selected ? ', selected' : ''}`}
        style={styles.pressable}
      >
        <Animated.View style={[styles.check, checkStyle]}>
          <Ionicons name="checkmark" size={14} color={colors.white} />
        </Animated.View>

        <View style={[styles.iconBox, { backgroundColor: `${skill.color}1A`, borderColor: `${skill.color}40` }]}>
          <AppIcon lib={skill.icon.lib} name={skill.icon.name} size={28} color={skill.color} />
        </View>

        <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={2}>
          {skill.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    minWidth: 100,
    minHeight: 104,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: '#F2F8FA' },
  pressable: { flex: 1, padding: spacing.md, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  check: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.label, color: colors.dark, textAlign: 'center' },
  labelSelected: { color: colors.primaryDark },
});

export default SkillCard;
