/**
 * Whether the user can load premium questions for a free category (demo + RevenueCat).
 * Used when appending questions after a purchase from shop / Oops.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

import {
  getPremiumQuestionsEntitlementId,
  RC_PRO_ENTITLEMENT_ID,
} from "@/constants/revenuecat";
import { initializeRevenueCat, isRevenueCatInitialized } from "@/lib/revenuecat";

export async function hasPremiumQuestionsAccess(
  categoryId: string
): Promise<boolean> {
  const [proValue, pqValue] = await Promise.all([
    AsyncStorage.getItem("demo_pro_purchased"),
    AsyncStorage.getItem("demo_unlocked_premium_questions"),
  ]);
  const isProDemo = proValue === "true";
  const unlockedIds: string[] = pqValue ? JSON.parse(pqValue) : [];
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
