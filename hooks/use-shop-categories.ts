/**
 * Hook for shop screen: uses useCategories and filters premium ones.
 * Reuses category fetch to avoid duplicate getCategories calls.
 */
import { useCategories } from "@/hooks/use-categories";
import { useMemo } from "react";

export function useShopCategories() {
  const { categories, loading } = useCategories();
  const premiumCategories = useMemo(
    () => categories.filter((c) => c.is_premium === true),
    [categories]
  );
  return { premiumCategories, loading };
}
