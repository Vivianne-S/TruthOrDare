// Position and size for a category bubble (x, y as 0–1 fraction of field; size in px)
export type BubbleSlot = {
  x: number;
  y: number;
  size: number;
};

// Categories that can be played without in-app purchase
export const FREE_START_CATEGORY_NAMES = new Set([
  "love and relationships",
  "funny",
  "chaos",
]);

// Predefined positions for category bubbles on the field (x, y as 0–1, size in px)
export const ORGANIC_CATEGORY_SLOTS: BubbleSlot[] = [
  { x: 0.06, y: 0.22, size: 124 },
  { x: 0.39, y: 0.07, size: 88 },
  { x: 0.7, y: 0.04, size: 86 },
  { x: 0.06, y: 0.03, size: 84 },
  { x: 0.47, y: 0.23, size: 94 },
  { x: 0.38, y: 0.42, size: 90 },
  { x: 0.06, y: 0.45, size: 92 },
  { x: 0.74, y: 0.22, size: 86 },
  { x: 0.04, y: 0.67, size: 86 },
  { x: 0.35, y: 0.6, size: 92 },
  { x: 0.66, y: 0.45, size: 120 },
  { x: 0.28, y: 0.79, size: 102 },
  { x: 0.62, y: 0.71, size: 88 },
];
