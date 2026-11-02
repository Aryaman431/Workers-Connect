import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import {
  AvailabilityToggle,
  FilterChip,
  ProfileHeader,
  Screen,
  SectionHeader,
  SecondaryButton,
  TextilePattern,
} from '../../components';
import { SkillChip } from '../../components/WorkerFlowBits';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { useAppState } from '../../state/AppContext';
import { SAMPLE_DATA_NOTE, languages, skillById, workers, type Skill } from '../../data/mockData';

const TAB_CLEARANCE = 120;
const GO_TO_SKILLS = () => router.push('/worker-tabs/skills');

type InfoCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function WorkerProfileScreen() {
  const { available, setAvailable, selectedSkills, language, setLanguage } = useAppState();
  const me = workers.find((w) => w.id === 'w1') ?? workers[0];

  const profileSkillIds = Array.from(new Set([...me.skills, ...selectedSkills]));
  const profileSkills = profileSkillIds.map(skillById).filter((s): s is Skill => Boolean(s));

  return (
    <Screen bg={colors.bg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero header with a subtle weave treatment. */}
        <Animated.View entering={enter.fadeUp()} style={styles.hero}>
          <TextilePattern color={colors.navy} opacity={0.05} count={8} />
          <ProfileHeader name={me.name} avatarColor={me.avatarColor} available={available} />
        </Animated.View>

        {/* Key facts */}
        <Animated.View entering={enter.fadeUp(60)} style={styles.infoGrid}>
          <InfoCard icon="briefcase" label="Experience" value={`${me.yearsExperience} years`} />
          <InfoCard icon="location" label="Location" value={me.location} />
          <InfoCard icon="shirt" label="Preferred work" value="Textile / Garment" />
          <InfoCard icon="time-outline" label="Shift" value={me.preferredWork} />
        </Animated.View>
        <Text style={styles.sampleNote}>Sample profile. {SAMPLE_DATA_NOTE}</Text>

        {/* Skills */}
        <Animated.View entering={enter.fadeUp(120)}>
          <SectionHeader title="MY SKILLS" action="Edit" onAction={GO_TO_SKILLS} />
          {profileSkills.length > 0 ? (
            <View style={styles.chipWrap}>
              {profileSkills.map((skill) => (
                <SkillChip key={skill.id} skill={skill} onPress={GO_TO_SKILLS} />
              ))}
            </View>
          ) : (
            <View style={styles.emptySkills}>
              <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.emptySkillsText}>Tap Edit to add your skills</Text>
            </View>
          )}
        </Animated.View>

        {/* Availability CTA */}
        <Animated.View entering={enter.fadeUp(160)} style={styles.ctaBlock}>
          <SectionHeader title="AVAILABILITY" />
          <AvailabilityToggle available={available} onToggle={() => setAvailable(!available)} />
          <SecondaryButton label="EDIT SKILLS" onPress={GO_TO_SKILLS} style={styles.secondary} />
        </Animated.View>

        {/* Language */}
        <Animated.View entering={enter.fadeUp(200)}>
          <SectionHeader title="LANGUAGE" />
          <View style={styles.chipWrap}>
            {languages.map((lang) => (
              <FilterChip
                key={lang.id}
                label={lang.label}
                active={language === lang.id}
                onPress={() => setLanguage(lang.id)}
              />
            ))}
          </View>
          <Text style={styles.languageNote}>Voice hints follow the language you pick.</Text>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: TAB_CLEARANCE,
    gap: spacing.lg,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadows.card,
  },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  infoCard: {
    flexBasis: '47.5%',
    flexGrow: 1,
    minHeight: 104,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: `${colors.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  infoLabel: { ...typography.caption, color: colors.muted },
  infoValue: { ...typography.bodyBold, color: colors.dark },
  sampleNote: { ...typography.caption, color: colors.muted, textAlign: 'center' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  emptySkills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    backgroundColor: `${colors.primary}0D`,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.lg,
  },
  emptySkillsText: { ...typography.label, color: colors.primary },

  ctaBlock: { gap: spacing.sm },
  secondary: { marginTop: spacing.xs },
  languageNote: { ...typography.caption, color: colors.muted, marginTop: spacing.sm },
});
