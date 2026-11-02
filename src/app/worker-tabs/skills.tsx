import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton, Screen, SpeakerButton, StatusBadge, TextilePattern } from '../../components';
import { BigSkillCard } from '../../components/WorkerFlowBits';
import { colors, radius, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { useAppState } from '../../state/AppContext';
import { skills } from '../../data/mockData';

const HINT = 'Tap the skills you know';
/** Keeps the sticky save bar clear of the floating glass tab bar (64 + inset). */
const TAB_CLEARANCE = 112;

export default function WorkerSkillsScreen() {
  const { selectedSkills, toggleSkill } = useAppState();
  const [saved, setSaved] = useState(false);

  const count = selectedSkills.length;

  // Brief local success feedback after saving — no backend involved.
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleToggle = (id: string) => {
    if (saved) setSaved(false);
    toggleSkill(id);
  };

  const handleSave = () => {
    if (count === 0) return;
    setSaved(true);
  };

  return (
    <Screen bg={colors.bg}>
      {/* Very low-opacity weave watermark behind the grid. */}
      <TextilePattern color={colors.navy} opacity={0.04} count={10} />

      <Animated.View entering={enter.fadeUp()} style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          What work can you do?
        </Text>
        <View style={styles.subRow}>
          <Text style={styles.subtitle}>{HINT}</Text>
          <SpeakerButton label={HINT} size={44} />
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.grid}>
          {skills.map((skill, i) => (
            <Animated.View key={skill.id} entering={enter.listRow(i)} style={styles.cell}>
              <BigSkillCard
                skill={skill}
                selected={selectedSkills.includes(skill.id)}
                onPress={() => handleToggle(skill.id)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky count + save bar. */}
      <View style={styles.saveBar}>
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {count} skill{count === 1 ? '' : 's'} selected
          </Text>
          {saved ? <StatusBadge label="SKILLS SAVED" variant="success" /> : null}
        </View>
        <PrimaryButton
          label={saved ? 'SKILLS SAVED' : 'SAVE SKILLS'}
          onPress={handleSave}
          disabled={count === 0}
          icon={saved ? <Ionicons name="checkmark-circle" size={20} color={colors.white} /> : undefined}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  title: { ...typography.h1, color: colors.dark },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  subtitle: { ...typography.body, color: colors.muted, flex: 1 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: { flexBasis: '47.5%', flexGrow: 1 },

  saveBar: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: TAB_CLEARANCE,
    gap: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  countText: { ...typography.label, color: colors.dark },
});
