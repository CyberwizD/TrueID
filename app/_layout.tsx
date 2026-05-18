import 'expo-dev-client';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TrueIdProvider } from '@/components/trueid-provider';
import { Colors } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      card: Colors.light.surface,
      border: Colors.light.line,
      primary: Colors.light.accent,
      text: Colors.light.text,
      notification: Colors.light.accent,
    },
  };

  return (
    <TrueIdProvider>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="caller/[phone]" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Privacy Promise' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </TrueIdProvider>
  );
}
