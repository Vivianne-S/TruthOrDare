export type BubbleSlot = {
  x: number;
  y: number;
  size: number;
};

export const CATEGORY_BUBBLE_SLOTS: BubbleSlot[] = [
  { x: 0.12, y: 0.16, size: 94 },
  { x: 0.6, y: 0.16, size: 100 },
  { x: 0.35, y: 0.37, size: 104 },
  { x: 0.72, y: 0.29, size: 92 },
  { x: 0.11, y: 0.42, size: 146 },
  { x: 0.5, y: 0.4, size: 95 },
  { x: 0.35, y: 0.54, size: 102 },
  { x: 0.7, y: 0.56, size: 132 },
  { x: 0.1, y: 0.66, size: 93 },
  { x: 0.36, y: 0.72, size: 106 },
  { x: 0.68, y: 0.75, size: 97 },
  { x: 0.34, y: 0.88, size: 118 },
];

export function getCategoryEmoji(name: string): string {
  const n = name.toLowerCase();

  if (n.includes('love') || n.includes('relation')) return '💜';
  if (n.includes('fun') || n.includes('party')) return '🤪';
  if (n.includes('spicy') || n.includes('chaos')) return '😈';
  if (n.includes('friend')) return '🫶';
  if (n.includes('couple')) return '💍';
  if (n.includes('random')) return '🎲';

  return '✨';
}
