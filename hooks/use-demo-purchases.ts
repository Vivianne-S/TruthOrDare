/**
 * Demo purchase hook for school project.
 * Simulates premium unlock without RevenueCat/Apple/Google.
 * Persists "purchase" in AsyncStorage across app restarts.
 * Supports: individual category ($4.99) and premium all-in-one ($19.99).
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const DEMO_PRO_KEY = "demo_pro_purchased";
const DEMO_UNLOCKED_CATEGORIES_KEY = "demo_unlocked_categories";

export function useDemoPurchases() {
  const [isPro, setIsPro] = useState(false);
  const [unlockedCategoryIds, setUnlockedCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  const refreshStatus = useCallback(async () => {
    try {
      const [proValue, categoriesValue] = await Promise.all([
        AsyncStorage.getItem(DEMO_PRO_KEY),
        AsyncStorage.getItem(DEMO_UNLOCKED_CATEGORIES_KEY),
      ]);
      setIsPro(proValue === "true");
      const ids = categoriesValue ? (JSON.parse(categoriesValue) as string[]) : [];
      setUnlockedCategoryIds(new Set(ids));
    } catch (e) {
      console.log("Demo purchases: failed to read AsyncStorage", e);
      setIsPro(false);
      setUnlockedCategoryIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const isCategoryUnlocked = useCallback(
    (categoryId: string) => isPro || unlockedCategoryIds.has(categoryId),
    [isPro, unlockedCategoryIds]
  );

  const unlockPremium = useCallback(async () => {
    try {
      await AsyncStorage.setItem(DEMO_PRO_KEY, "true");
      setIsPro(true);
    } catch (e) {
      console.log("Demo purchases: failed to persist premium", e);
    }
  }, []);

  const unlockCategory = useCallback(async (categoryId: string) => {
    try {
      const next = new Set(unlockedCategoryIds).add(categoryId);
      await AsyncStorage.setItem(
        DEMO_UNLOCKED_CATEGORIES_KEY,
        JSON.stringify([...next])
      );
      setUnlockedCategoryIds(next);
    } catch (e) {
      console.log("Demo purchases: failed to persist category", e);
    }
  }, [unlockedCategoryIds]);

  const resetPurchases = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(DEMO_PRO_KEY),
        AsyncStorage.removeItem(DEMO_UNLOCKED_CATEGORIES_KEY),
      ]);
      setIsPro(false);
      setUnlockedCategoryIds(new Set());
    } catch (e) {
      console.log("Demo purchases: failed to reset", e);
    }
  }, []);

  return {
    isPro,
    loading,
    isCategoryUnlocked,
    refreshProStatus: refreshStatus,
    unlockPremium,
    unlockCategory,
    resetPurchases,
  };
}
