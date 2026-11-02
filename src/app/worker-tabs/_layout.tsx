import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassTabBar } from '../../components';
import { colors, typography } from '../../theme';

/** Worker mode tab bar — Home, Skills, Profile. */
export default function WorkerTabsLayout() {
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
        name="home"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          title: 'Skills',
          tabBarAccessibilityLabel: 'Skills',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'view-grid' : 'view-grid-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
