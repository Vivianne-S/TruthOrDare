/**
 * Line height multipliers for text elements.
 *
 * These are unitless values that multiply the element's font size to determine
 * line height. Must be applied by multiplying with the actual font size value.
 *
 * @example
 * // In React Native styles - multiply with fontSize
 * {
 *   fontSize: FONT_SIZES.body,  // 16px
 *   lineHeight: FONT_SIZES.body * LINE_HEIGHT.normal  // 16 * 1.5 = 24px
 * }
 */
export const LINE_HEIGHT = {
    none: 1, // No extra line height (not recommended for body text)
    extraTight: 1.15, // Very compact spacing for headings
    tight: 1.2, // Compact spacing for large headings
    snug: 1.4, // Comfortable spacing for UI elements
    normal: 1.5, // Standard spacing for body text
    relaxed: 1.6, // Generous spacing for readability
    extraRelaxed: 1.75, // Maximum spacing for long-form content
  } as const;