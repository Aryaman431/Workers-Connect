import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';

import {
  AppHeader,
  AvailabilityToggle,
  FilterChip,
  Screen,
  StatusBadge,
  TextilePattern,
} from '../components';
import { AvailabilityRing } from '../components/WorkerFlowBits';
import { colors, radius, spacing, typography } from '../theme';
import { enter } from '../theme/motion';
import { useAppState } from '../state/AppContext';

type Range = 'today' | 'week';

/** Worker availability — pushed from worker home on the root stack. */
export default function AvailabilityScreen() {
  const { available, setAvailable } = useAppState();
  const [range, setRange] = useState<Range>('today');

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/worker-tabs/home');
  };

  return (
    <Screen bg={colors.bg}>
      <TextilePattern color={colors.navy} opacity={0.05} count={10} />
      <AppHeader title="Availability" showBack onBack={goBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Big centered availability visual. */}
        <Animated.View entering={enter.fadeUp()} style={styles.center}>
          <Animated.View entering={enter.fadeUp(60)}>
            <AvailabilityRing available={available} />
          </Animated.View>

          <Text
            style={[styles.status, { color: available ? colors.success : colors.dark }]}
            accessibilityRole="header"
          >
            {available ? 'AVAILABLE FOR WORK' : 'NOT AVAILABLE'}
          </Text>

          <StatusBadge
            label={available ? 'AVAILABLE TODAY' : 'NOT AVAILABLE TODAY'}
            variant={available ? 'success' : 'muted'}
          />

          <Text style={styles.explain}>Employers can see you when you are available.</Text>
        </Animated.View>

        {/* Primary toggle. */}
        <Animated.View entering={enter.fadeUp(120)}>
          <AvailabilityToggle available={available} onToggle={() => setAvailable(!available)} />
        </Animated.View>

        {/* Quick range chips — visual state only in this prototype. */}
        <Animated.View entering={enter.fadeUp(200)} style={styles.rangeBlock}>
          <Text style={styles.rangeLabel}>HOW LONG?</Text>
          <View style={styles.rangeRow}>
            <FilterChip
              label="Available today"
              active={range === 'today'}
              onPress={() => setRange('today')}
            />
            <FilterChip label="This week" active={range === 'week'} onPress={() => setRange('week')} />
          </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  center: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.lg },
  status: { ...typography.display, fontSize: 32, lineHeight: 38, textAlign: 'center' },
  explain: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 300,
    marginTop: spacing.xs,
  },

  rangeBlock: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  rangeLabel: {
    ...typography.caption,
    color: colors.muted,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  rangeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
