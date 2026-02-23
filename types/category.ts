export type Category = {
  id: string;
  name: string;
  icon: string | null;
  is_premium: boolean;
  sort_order?: number | null;
};

export type Question = {
  type: string;
  question_text: string;
};
