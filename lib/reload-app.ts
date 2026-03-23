/**
 * Full JavaScript reload (dev: DevSettings.reload; prod: expo-updates).
 * Used for multiplayer when host exits so all clients get a clean session.
 */
import { router } from "expo-router";
import { DevSettings, Platform } from "react-native";

export async function reloadApp(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      router.replace("/");
      return;
    }
    if (__DEV__) {
      DevSettings.reload();
      return;
    }
    const Updates = await import("expo-updates");
    await Updates.reloadAsync();
  } catch {
    router.replace("/");
  }
}
