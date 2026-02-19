import { supabase } from "@/lib/supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getQuestionsByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("type, question_text")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}