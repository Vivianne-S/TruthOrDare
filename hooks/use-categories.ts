/**
 * Categories hook: fetches categories from Supabase and caches questions per category.
 * When user selects a category, questions are pre-loaded for faster game start.
 * Used by categories screen.
 */
import { getCategories, getQuestionsByCategory } from "@/services/categories";
import type { Category, Question } from "@/types/category";
import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsByCategory, setQuestionsByCategory] = useState<
    Record<string, Question[]>
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

    return () => {
      alive = false;
    };
  }, []);

  // Pre-load questions when user selects a category (for tracking and faster game start)
  const handlePressCategory = async (categoryId: string) => {
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      return;
    }

    setOpenCategoryId(categoryId);

    if (
      questionsByCategory[categoryId] ||
      questionsLoadingByCategory[categoryId] === true
    ) {
      return;
    }

    try {
      setQuestionsLoadingByCategory((prev) => ({
        ...prev,
        [categoryId]: true,
      }));

      const data = await getQuestionsByCategory(categoryId);
      setQuestionsByCategory((prev) => ({
        ...prev,
        [categoryId]: data,
      }));
    } catch (e) {
      console.log("getQuestionsByCategory error:", e);
    } finally {
      setQuestionsLoadingByCategory((prev) => ({
        ...prev,
        [categoryId]: false,
      }));
    }
  };

  return {
    categories,
    loading,
    openCategoryId,
    questionsByCategory,
    questionsLoadingByCategory,
    handlePressCategory,
  };
}
