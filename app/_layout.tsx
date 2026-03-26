import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DBProvider } from '@/contexts/db-context';
import { theme } from '@/constants/theme';

const NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.ink,
    border: theme.colors.border,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <DBProvider>
      <ThemeProvider value={NavTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-habit"
            options={{ presentation: 'formSheet', headerShown: false }}
          />
          <Stack.Screen
            name="habit/[id]"
            options={{ presentation: 'formSheet', headerShown: false }}
          />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </DBProvider>
  );
}
