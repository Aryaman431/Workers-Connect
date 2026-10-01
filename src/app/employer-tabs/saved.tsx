import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppHeader, Screen } from '../../components';
import { EmptyState, EmployerWorkerCard, SampleCaption } from '../../components/EmployerFlowBits';
import { colors, spacing } from '../../theme';
import { workers } from '../../data/mockData';
import { useAppState } from '../../state/AppContext';

/** Keeps the last card clear of the floating tab bar (64 + inset). */
const TAB_BAR_CLEARANCE = 112;

export default function EmployerSavedScreen() {
  const { savedWorkerIds, toggleSaved } = useAppState();
  const savedWorkers = workers.filter((worker) => savedWorkerIds.includes(worker.id));

  return (
    <Screen bg={colors.bg} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(280)}>
        <AppHeader
          title="Saved workers"
          subtitle={`${savedWorkers.length} ${savedWorkers.length === 1 ? 'worker' : 'workers'} saved`}
        />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {savedWorkers.length === 0 ? (
          <EmptyState
            icon={{ lib: 'Ionicons', name: 'bookmark' }}
            title="No saved workers yet"
            message="Workers you save from search will appear here."
            actionLabel="Browse workers"
            onAction={() => router.push('/employer-tabs/search')}
          />
        ) : (
          <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.list}>
            {savedWorkers.map((worker, index) => (
              <EmployerWorkerCard
                key={worker.id}
                worker={worker}
                index={index}
                saved
                onToggleSave={() => toggleSaved(worker.id)}
                onView={() => router.push(`/worker/${worker.id}`)}
              />
            ))}
            <SampleCaption text="Sample profiles for demonstration." />
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: TAB_BAR_CLEARANCE },
  list: { gap: spacing.lg },
});
