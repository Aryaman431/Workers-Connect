import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';

import { Screen, SearchBar, SectionHeader, SpeakerButton, SkillCard, TextilePattern } from '../../components';
import {
  EmptyState,
  EmployerMark,
  EmployerWorkerCard,
  HeroStatusBar,
  SampleCaption,
} from '../../components/EmployerFlowBits';
import { colors, radius, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { skillById, skills, workers } from '../../data/mockData';
import { useAppState } from '../../state/AppContext';

/** Keeps the last card clear of the floating tab bar (64 + inset). */
const TAB_BAR_CLEARANCE = 112;

export default function EmployerSearchScreen() {
  const insets = useSafeAreaInsets();
  const { selectedSkills, toggleSkill, savedWorkerIds, toggleSaved } = useAppState();
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    const matched = workers.filter((worker) => {
      const skillMatch =
        selectedSkills.length === 0 || worker.skills.some((id) => selectedSkills.includes(id));
      if (!skillMatch) return false;
      if (trimmed.length === 0) return true;
      const skillLabels = worker.skills.map((id) => skillById(id)?.label.toLowerCase() ?? '');
      const haystack = [worker.name.toLowerCase(), worker.location.toLowerCase(), ...skillLabels].join(' ');
      return haystack.includes(trimmed);
    });
    // Available workers lead the list; busy workers follow, dimmed.
    return matched.slice().sort((a, b) => Number(b.available) - Number(a.available));
  }, [selectedSkills, trimmed]);

  const heading = useMemo(() => {
    if (trimmed.length > 0) return 'Search results';
    if (selectedSkills.length === 1) {
      const skill = skillById(selectedSkills[0]);
      return skill ? `${skill.label} workers` : 'Matched workers';
    }
    if (selectedSkills.length > 1) return 'Matched workers';
    return 'Available workers';
  }, [trimmed, selectedSkills]);

  const clearFilters = () => {
    setQuery('');
    selectedSkills.forEach((id) => toggleSkill(id));
  };

  return (
    <Screen bg={colors.bg} edges={[]}>
      <HeroStatusBar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Dark navy search-focused hero */}
        <Animated.View entering={enter.fadeUp()}>
          <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
            <TextilePattern color={colors.white} opacity={0.08} count={14} />
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroKicker}>EMPLOYER</Text>
                <Text style={styles.heroTitle} accessibilityRole="header">
                  Find workers
                </Text>
                <Text style={styles.heroSub}>Search by skill and availability.</Text>
              </View>
              <EmployerMark size={56} dark />
            </View>
          </View>
        </Animated.View>

        {/* Search bar overlapping the hero edge */}
        <Animated.View entering={enter.fadeUp(90)} style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search worker or skill…" />
        </Animated.View>

        {/* Skill picker */}
        <Animated.View entering={enter.fadeUp(150)} style={styles.section}>
          <View style={styles.headRow}>
            <View style={styles.headFlex}>
              <SectionHeader title="What skill do you need?" />
            </View>
            <SpeakerButton label="What skill do you need?" />
          </View>
          <View style={styles.skillGrid}>
            {skills.map((skill) => (
              <View key={skill.id} style={styles.skillGridItem}>
                <SkillCard
                  skill={skill}
                  selected={selectedSkills.includes(skill.id)}
                  onPress={() => toggleSkill(skill.id)}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Results */}
        <Animated.View entering={enter.fadeUp(220)} style={styles.section}>
          <View style={styles.resultsHead}>
            <Text style={styles.resultsTitle} accessibilityRole="header">
              {heading}
            </Text>
            <View style={styles.countPill} accessibilityLabel={`${results.length} workers found`}>
              <Text style={styles.countText}>{results.length}</Text>
            </View>
          </View>

          {results.length === 0 ? (
            <EmptyState
              icon={{ lib: 'Ionicons', name: 'search' }}
              title="No workers match"
              message="Try a different skill, or clear what you have selected."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          ) : (
            <View style={styles.resultsList}>
              {results.map((worker, index) => (
                <EmployerWorkerCard
                  key={worker.id}
                  worker={worker}
                  index={index}
                  saved={savedWorkerIds.includes(worker.id)}
                  onToggleSave={() => toggleSaved(worker.id)}
                  onView={() => router.push(`/worker/${worker.id}`)}
                />
              ))}
              <SampleCaption text="Sample profiles for demonstration." />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: TAB_BAR_CLEARANCE },
  hero: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingTop: spacing.lg },
  heroCopy: { flex: 1, gap: spacing.xs },
  heroKicker: { ...typography.caption, color: colors.accent, fontWeight: '800', letterSpacing: 2 },
  heroTitle: { ...typography.h1, color: colors.white },
  heroSub: { ...typography.body, color: colors.darkMuted },
  searchWrap: { paddingHorizontal: spacing.lg, marginTop: -spacing.xl },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headFlex: { flex: 1 },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  skillGridItem: { width: '48%' },
  resultsHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  resultsTitle: { ...typography.h3, color: colors.dark, flexShrink: 1 },
  countPill: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: spacing.sm,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { ...typography.caption, color: colors.primaryDark, fontWeight: '800' },
  resultsList: { gap: spacing.lg },
});
