/**
 * Root layout for the Truth or Dare app.
 * Configures the main Stack navigator. Uses fixed dark theme.
 */
import { I18nProvider } from "@/context/I18nContext";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <I18nProvider>
      <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="how-to-play" options={{ headerShown: false }} />
        <Stack.Screen name="game-mode-select" options={{ headerShown: false }} />
        <Stack.Screen name="join-game" options={{ headerShown: false }} />
        <Stack.Screen name="create-game" options={{ headerShown: false }} />
        <Stack.Screen name="game-lobby" options={{ headerShown: false }} />
        <Stack.Screen name="add-players" options={{ headerShown: false }} />
        <Stack.Screen name="categories" options={{ headerShown: false }} />
        <Stack.Screen name="shop" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </I18nProvider>
  );
}
