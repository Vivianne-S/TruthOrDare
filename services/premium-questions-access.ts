/**
 * Whether the user can load premium questions for a free category (demo + RevenueCat).
 * Used when appending questions after a purchase from shop / Oops.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

import {
  DEMO_PRO_KEY,
  DEMO_UNLOCKED_PREMIUM_QUESTIONS_KEY,
} from "@/constants/demo-purchases";
import {
  getPremiumQuestionsEntitlementId,
  RC_PRO_ENTITLEMENT_ID,
} from "@/constants/revenuecat";
import { initializeRevenueCat, isRevenueCatInitialized } from "@/lib/revenuecat";

function parseUnlockedIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export async function hasPremiumQuestionsAccess(
  categoryId: string
): Promise<boolean> {
  const [proValue, pqValue] = await Promise.all([
    AsyncStorage.getItem(DEMO_PRO_KEY),
    AsyncStorage.getItem(DEMO_UNLOCKED_PREMIUM_QUESTIONS_KEY),
  ]);
  const isProDemo = proValue === "true";
  const unlockedIds = parseUnlockedIds(pqValue);
  if (isProDemo || unlockedIds.includes(categoryId)) return true;

  try {
    await initializeRevenueCat();
    if (!isRevenueCatInitialized()) return false;
    await Purchases.syncPurchases();
    const info = await Purchases.getCustomerInfo();
    const active = info.entitlements.active;
    if (active[RC_PRO_ENTITLEMENT_ID]?.isActive) return true;
    const pqEnt = getPremiumQuestionsEntitlementId(categoryId);
    return !!active[pqEnt]?.isActive;
  } catch {
    return false;
  }
}
