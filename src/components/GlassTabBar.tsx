import React from 'react';
import type { ColorValue } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { absoluteFill, colors, glass, spacing, typography } from '../theme';

/** Visible bar height above the home-indicator inset (matches the old native bar). */
const BAR_HEIGHT = 64;
const ICON_SIZE = 24;
/** Icon → label gap, matching the old `tabBarLabelStyle: { marginTop: 2 }`. */
const STACK_GAP = 2;

type TabRoute = { key: string; name: string };

type TabBarIconProps = { color: ColorValue; focused: boolean; size: number };

type TabBarOptions = {
  title?: string;
  tabBarAccessibilityLabel?: string;
  tabBarIcon?: (props: TabBarIconProps) => React.ReactNode;
};

type TabPressEvent = { type: 'tabPress'; target: string; canPreventDefault: true };

/**
 * Structural mirror of the bottom-tab bar props (`BottomTabBarProps`).
 *
 * Typed by shape instead of importing `@react-navigation/bottom-tabs` so the
 * component can be handed to expo-router's `<Tabs tabBar={...}>` without a
 * dependency on a package that is only present transitively. Every property is
 * a subset of what the navigator passes at runtime, which keeps the assignment
 * contravariantly compatible.
 */
export type GlassTabBarProps = {
  state: { index: number; routes: readonly TabRoute[] };
  descriptors: Record<string, { options: TabBarOptions }>;
  navigation: {
    navigate: (name: string) => void;
    /** Optional: mirrors the default bar's preventable `tabPress` event. */
    emit?: (event: TabPressEvent) => { defaultPrevented: boolean };
  };
};

/**
 * Floating glass tab bar.
 *
 * Layer order: BlurView → strong fill → top hairline → row of tab buttons.
 *
 * The navigator renders a custom `tabBar` in flow, so the root floats itself
 * (`left/right/bottom: 0`) and the scene underneath runs full height — screens
 * keep their own bottom clearance for it. `overflow: 'hidden'` on the root is
 * required because React Native does not clip `BlurView` corners on its own.
 * Android has no BlurTargetView plumbing here, so the blur falls back to a
 * translucent tint layer — accepted per the design.
 */
export function GlassTabBar({ state, descriptors, navigation }: GlassTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          height: BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
        },
      ]}
    >
      <BlurView
        pointerEvents="none"
        intensity={glass.intensityHigh}
        tint={glass.tint}
        style={absoluteFill}
      />
      <View pointerEvents="none" style={[absoluteFill, styles.fill]} />
      <View pointerEvents="none" style={styles.hairline} />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = index === state.index;
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const color = focused ? colors.primary : colors.muted;

          const onPress = () => {
            // Mirrors the default bar: emit a preventable `tabPress`, ignore
            // presses on the focused tab, otherwise switch routes.
            const event = navigation.emit?.({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (focused || event?.defaultPrevented) return;
            navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              hitSlop={{ top: 12, bottom: 12, left: 0, right: 0 }}
              style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
            >
              {options.tabBarIcon ? (
                <View style={styles.icon} importantForAccessibility="no">
                  {options.tabBarIcon({ color, focused, size: ICON_SIZE })}
                </View>
              ) : null}
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    paddingTop: spacing.sm,
    // Restrained upward shadow: only the top edge of a bottom bar is visible.
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  fill: { backgroundColor: glass.fillStrong },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: glass.hairline,
  },
  row: { flex: 1, flexDirection: 'row' },
  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    gap: STACK_GAP,
  },
  tabPressed: { opacity: 0.7 },
  icon: { height: ICON_SIZE, alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.caption, fontSize: 11, fontWeight: '600', textAlign: 'center' },
});

export default GlassTabBar;
