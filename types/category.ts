// Category from Supabase; is_premium controls whether it's locked behind IAP
export type Category = {
  id: string;
  name: string;
  icon: string | null;
  is_premium: boolean;
  sort_order?: number | null;
};

// Question from Supabase; type is typically "truth" or "dare"
export type Question = {
  type: string;
  question_text: string;
};
