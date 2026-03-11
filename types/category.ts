import type { BubbleSlot } from "@/constants/category-bubbles";

// Category from Supabase; is_premium controls whether it's locked behind IAP
export type Category = {
  id: string;
  name: string;
  icon: string | null;
  is_premium: boolean;
  sort_order?: number | null;
};

// Category bubble for display: Category + slot, isLocked, sourceCategoryId
export type CategoryBubble = {
  id: string;
  name: string;
  icon: string | null;
  slot: BubbleSlot;
  isLocked: boolean;
  sourceCategoryId: string;
};

// Question from Supabase; type is typically "truth" or "dare"
export type Question = {
  type: string;
  question_text: string;
  question_text_sv?: string | null;
};
