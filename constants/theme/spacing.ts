// ===============================
// SPACING
// ===============================

export const BASE_SPACING = 4;

/**
 * Converts a spacing level to pixels or normalizes a pixel value to the nearest spacing level.
 *
 * @param value - The spacing level (multiplier) or pixel value to convert
 * @param isPx - If true, treats `value` as pixels and rounds to nearest spacing level. Default is false
 * @returns The calculated spacing value in pixels
 *
 * @example
 * // Using spacing levels
 * setSpacing(4) // Returns 16 (4 * BASE_SPACING)
 *
 * @example
 * // Normalizing pixel values to spacing scale
 * setSpacing(17, true) // Returns 16 (nearest spacing level to 17px)
 */
export const setSpacing = (levelOrPx: number, isPx: boolean = false) => {
  if (isPx) {
    return Math.round(levelOrPx / BASE_SPACING) * BASE_SPACING;
  }

  return levelOrPx * BASE_SPACING;
};

export const SPACING = {
  x0: 0,
  x1: setSpacing(1),    // 4
  x2: setSpacing(2),    // 8
  x3: setSpacing(3),    // 12
  x4: setSpacing(4),    // 16
  x5: setSpacing(5),    // 20
  x6: setSpacing(6),    // 24
  x7: setSpacing(7),    // 28
  x8: setSpacing(8),    // 32
  x9: setSpacing(9),    // 36
  x10: setSpacing(10),  // 40
  x12: setSpacing(12),  // 48
  x14: setSpacing(14),  // 56
  x16: setSpacing(16),  // 64
  x18: setSpacing(18),  // 72
  x20: setSpacing(20),  // 80
  x22: setSpacing(22),  // 88
  x24: setSpacing(24),  // 96

} as const;