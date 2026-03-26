import { Platform } from "react-native";
import Purchases from "react-native-purchases";

let initialized = false;

export async function initializeRevenueCat() {
  if (initialized || Platform.OS === "web") {
    return;
  }

  const testStoreApiKey = process.env.EXPO_PUBLIC_RC_TEST_API_KEY;
  const iosApiKey = process.env.EXPO_PUBLIC_RC_IOS_API_KEY;
  const androidApiKey = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY;
  const apiKey =
    testStoreApiKey || (Platform.OS === "ios" ? iosApiKey : androidApiKey);

  if (!apiKey) {
    console.log(
      "RevenueCat not configured: missing EXPO_PUBLIC_RC_TEST_API_KEY or platform keys"
    );
    return;
  }

  Purchases.setLogLevel(
    __DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.WARN
  );
  await Purchases.configure({ apiKey });
  initialized = true;
}

export function isRevenueCatInitialized() {
  return initialized;
}
