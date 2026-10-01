import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RoleCard, Screen, TextilePattern } from '../components';
import { colors, spacing, typography } from '../theme';
import { useAppState, type Role } from '../state/AppContext';

export default function RoleScreen() {
  const { setRole } = useAppState();
  const [selected, setSelected] = useState<Role | null>(null);

  const choose = (role: Role) => {
    if (selected) return;
    setSelected(role);
    setRole(role);
    setTimeout(() => {
      router.replace(role === 'worker' ? '/worker-tabs/home' : '/employer-tabs/search');
    }, 300);
  };

  return (
    <Screen bg={colors.bg} edges={['top', 'bottom']}>
      <TextilePattern color={colors.navy} opacity={0.05} count={10} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360)} style={styles.header}>
          <Text style={styles.kicker}>GET STARTED</Text>
          <Text style={styles.title} accessibilityRole="header">
            How will you use Worker Connect?
          </Text>
          <Text style={styles.subtitle}>Choose one. You can explore the other side any time.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.cards}>
          <RoleCard
            role="worker"
            title="WORKER"
            subtitle="Find work using your skills"
            primaryIcon={{ lib: 'Ionicons', name: 'person' }}
            secondaryIcon={{ lib: 'MaterialCommunityIcons', name: 'needle' }}
            selected={selected === 'worker'}
            onPress={() => choose('worker')}
          />

          <RoleCard
            role="employer"
            title="EMPLOYER"
            subtitle="Find workers by skill"
            primaryIcon={{ lib: 'MaterialCommunityIcons', name: 'factory' }}
            secondaryIcon={{ lib: 'MaterialCommunityIcons', name: 'account-group' }}
            selected={selected === 'employer'}
            onPress={() => choose('employer')}
          />
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl },
  header: { gap: spacing.sm, marginTop: spacing.lg },
  kicker: { ...typography.caption, color: colors.accent, fontWeight: '800', letterSpacing: 2 },
  title: { ...typography.h1, color: colors.dark },
  subtitle: { ...typography.body, color: colors.muted },
  cards: { gap: spacing.lg },
});
