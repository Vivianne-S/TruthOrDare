/**
 * Categories hook: fetches categories from Supabase and caches questions per category.
 * When user selects a category, questions are pre-loaded for faster game start.
 * Used by categories screen.
 * Filters premium questions in free categories unless user has purchased them.
 *
 * Pass the same `isCategoryUnlocked` / `isPremiumQuestionsUnlocked` as the screen that
 * calls purchase status hooks so reset/focus-refresh stays in sync with the cache.
 * Callers that only need the category list (e.g. shop) can omit args; defaults treat
 * everything as locked.
 */
import { getCategories, getQuestionsByCategory } from "@/services/categories";
import type { Category, Question } from "@/types/category";
import { useCallback, useEffect, useState } from "react";

export function useCategories(
  isCategoryUnlocked: (categoryId: string) => boolean = () => false,
  isPremiumQuestionsUnlocked: (categoryId: string) => boolean = () => false
) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsByCategory, setQuestionsByCategory] = useState<
    Record<string, { questions: Question[]; includePremium: boolean }>
  >({});
  const [questionsLoadingByCategory, setQuestionsLoadingByCategory] = useState<
    Record<string, boolean>
  >({});
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getCategories();
        if (alive) setCategories(data);
      } catch (e) {
        console.log("getCategories error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const getIncludePremium = useCallback(
    (categoryId: string): boolean => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return false;
      if (category.is_premium) {
        return isCategoryUnlocked(categoryId);
      }
      return isPremiumQuestionsUnlocked(categoryId);
    },
    [categories, isCategoryUnlocked, isPremiumQuestionsUnlocked]
  );

  const handlePressCategory = useCallback(
    async (categoryId: string) => {
      if (openCategoryId === categoryId) {
        setOpenCategoryId(null);
        return;
      }

      setOpenCategoryId(categoryId);

      const includePremium = getIncludePremium(categoryId);
      const cached = questionsByCategory[categoryId];
      const cacheValid =
        cached &&
        cached.includePremium === includePremium &&
        questionsLoadingByCategory[categoryId] !== true;

      if (cacheValid) {
        return;
      }

      try {
        setQuestionsLoadingByCategory((prev) => ({
          ...prev,
          [categoryId]: true,
        }));

        const data = await getQuestionsByCategory(categoryId, {
          includePremium,
        });
        setQuestionsByCategory((prev) => ({
          ...prev,
          [categoryId]: { questions: data, includePremium },
        }));
      } catch (e) {
        console.log("getQuestionsByCategory error:", e);
      } finally {
        setQuestionsLoadingByCategory((prev) => ({
          ...prev,
          [categoryId]: false,
        }));
      }
    },
    [
      openCategoryId,
      questionsByCategory,
      questionsLoadingByCategory,
      getIncludePremium,
    ]
  );

  return {
    categories,
    loading,
    openCategoryId,
    questionsByCategory,
    questionsLoadingByCategory,
    handlePressCategory,
    getIncludePremium,
  };
}
