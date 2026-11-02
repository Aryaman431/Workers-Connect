import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassTabBar } from '../../components';
import { colors, typography } from '../../theme';

/** Employer mode tab bar — Search, Saved, Profile. */
export default function EmployerTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={GlassTabBar}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { ...typography.caption, fontSize: 11, fontWeight: '600', marginTop: 2 },
        // Floating glass bar: the scene runs to the bottom edge and screens
        // carry their own clearance. `GlassTabBar` owns the inset padding.
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 64 + insets.bottom,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
        },
        tabBarIconStyle: { marginTop: 2 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarAccessibilityLabel: 'Search workers',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarAccessibilityLabel: 'Saved workers',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Account and settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
