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

export async function getQuestionsByCategory(
  categoryId: string
): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("type, question_text")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Question[];
}