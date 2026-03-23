/**
 * Supabase-backed category and question fetching.
 * getCategories: fetches all categories ordered by sort_order.
 * getQuestionsByCategory: fetches questions for a category (used when starting a game).
 */
import { supabase } from "@/lib/supabase";
import type { Category, Question } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getCategoryById(
  categoryId: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) throw error;
  return (data as Category) ?? null;
}

export async function getQuestionsByCategory(
  categoryId: string,
  options?: { includePremium?: boolean }
): Promise<Question[]> {
  const includePremium = options?.includePremium ?? false;

  let query = supabase
    .from("questions")
    .select("type, question_text, question_text_sv")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: true });

  if (!includePremium) {
    query = query.or("is_premium.eq.false,is_premium.is.null");
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as Question[];
}