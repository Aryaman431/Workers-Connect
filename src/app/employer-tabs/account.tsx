import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  AppIcon,
  FilterChip,
  Screen,
  SectionHeader,
  SecondaryButton,
  SpeakerButton,
} from '../../components';
import { EmployerMark, SampleCaption } from '../../components/EmployerFlowBits';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { enter } from '../../theme/motion';
import { SAMPLE_DATA_NOTE, languages } from '../../data/mockData';
import { useAppState } from '../../state/AppContext';

/** Keeps the last card clear of the floating tab bar (64 + inset). */
const TAB_BAR_CLEARANCE = 112;

export default function EmployerAccountScreen() {
  const { language, setLanguage, setRole } = useAppState();

  const switchToWorker = () => {
    setRole('worker');
    router.replace('/worker-tabs/home');
  };

  return (
    <Screen bg={colors.bg} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Employer identity */}
        <Animated.View entering={enter.fadeUp()} style={styles.identity}>
          <EmployerMark size={84} initials="ST" />
          <Text style={styles.name} accessibilityRole="header">
            Shakti Staffing
          </Text>
          <Text style={styles.role}>Employer Account</Text>
          <SampleCaption text="Sample account for demonstration." />
        </Animated.View>

        {/* Language */}
        <Animated.View entering={enter.fadeUp(100)} style={[styles.card, shadows.card]}>
          <View style={styles.headRow}>
            <View style={styles.headFlex}>
              <SectionHeader title="Language" />
            </View>
            <SpeakerButton label="Language options" />
          </View>
          <View style={styles.chipRow}>
            {languages.map((lang) => (
              <View key={lang.id} style={styles.chipHit}>
                <FilterChip
                  label={lang.label}
                  active={language === lang.id}
                  onPress={() => setLanguage(lang.id)}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Role mode */}
        <Animated.View entering={enter.fadeUp(180)} style={[styles.card, shadows.card]}>
          <View style={styles.roleRow}>
            <View style={styles.roleIcon}>
              <MaterialCommunityIcons name="factory" size={26} color={colors.primary} />
            </View>
            <View style={styles.roleCopy}>
              <Text style={styles.roleTitle}>Using as EMPLOYER</Text>
              <Text style={styles.roleSub}>Switch modes any time.</Text>
            </View>
          </View>
          <SecondaryButton
            label="Switch to Worker"
            onPress={switchToWorker}
            icon={<AppIcon lib="Ionicons" name="swap-horizontal" size={18} color={colors.primary} />}
            style={styles.fullBtn}
          />
        </Animated.View>

        {/* About */}
        <Animated.View entering={enter.fadeUp(260)} style={[styles.card, shadows.card]}>
          <Text style={styles.aboutTitle} accessibilityRole="header">
            Worker Connect
          </Text>
          <Text style={styles.aboutBody}>Find the right worker. Find work faster.</Text>
          <Text style={styles.aboutNote}>{SAMPLE_DATA_NOTE}</Text>
          <Text style={styles.aboutTiny}>Prototype for societal impact project (SDG 8)</Text>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: TAB_BAR_CLEARANCE, gap: spacing.xl },
  identity: { alignItems: 'center', gap: spacing.xs },
  name: { ...typography.h2, color: colors.dark, marginTop: spacing.sm },
  role: { ...typography.label, color: colors.primary, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headFlex: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chipHit: { paddingVertical: 4 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCopy: { flex: 1, gap: 2 },
  roleTitle: { ...typography.bodyBold, color: colors.dark },
  roleSub: { ...typography.caption, color: colors.muted },
  fullBtn: { width: '100%' },
  aboutTitle: { ...typography.h3, color: colors.dark },
  aboutBody: { ...typography.body, color: colors.dark },
  aboutNote: { ...typography.caption, color: colors.muted },
  aboutTiny: { ...typography.caption, fontSize: 11, color: colors.muted, marginTop: spacing.xs },
});
