/**
 * Hook for shop screen: uses useCategories and filters premium ones
 * and free categories that have premium question packages (Chaos, Funny, Love & Relationships).
 * Reuses category fetch to avoid duplicate getCategories calls.
 */
import { FREE_START_CATEGORY_NAMES } from "@/constants/category-bubbles";
import { useCategories } from "@/hooks/use-categories";
import { useMemo } from "react";

export function useShopCategories() {
  const { categories, loading } = useCategories();
  const premiumCategories = useMemo(
    () => categories.filter((c) => c.is_premium === true),
    [categories]
  );
  const freeCategoriesWithPremiumQuestions = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.is_premium === false &&
          FREE_START_CATEGORY_NAMES.has(c.name.toLowerCase().trim())
      ),
    [categories]
  );
  return {
    premiumCategories,
    freeCategoriesWithPremiumQuestions,
    loading,
  };
}
