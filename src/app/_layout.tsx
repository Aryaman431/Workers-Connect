import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from '../state/AppContext';
import { colors } from '../theme';

/**
 * Root stack. Every screen draws its own header (`headerShown: false`),
 * dark status bar content throughout (light backgrounds).
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="role" />
          <Stack.Screen name="worker-tabs" />
          <Stack.Screen name="employer-tabs" />
          <Stack.Screen name="availability" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="worker/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="job/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
