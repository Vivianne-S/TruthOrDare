import { FONT_SIZES } from "./fontSizes";
import { LINE_HEIGHT } from "./lineHeight";

/**
 * Base typography styles defining font sizes, line heights, and letter spacing.
 * 
 * These are foundation styles without font family or color assignments.
 * Use these directly in components or as building blocks for complete TYPOGRAPHY variants.
 * 
 * @constant
 * @example
 * // Direct usage in a component
 * <Text style={TYPOGRAPHY_BASE.h1}>Heading</Text>
 * 
 * @example
 * // Creating a new variant
 * // Add to this object using the template pattern below
 */
export const TYPOGRAPHY_BASE = {
  // template: {
  //   fontSize: FONT_SIZES.size,
  //   lineHeight: FONT_SIZES.size * LINE_HEIGHT.lineHeightMultiplier,
  //   letterSpacing: FONT_SIZES.size * -0.01,
  // },
  hero1: {
    fontSize: FONT_SIZES.hero1,
    lineHeight: FONT_SIZES.hero1 * LINE_HEIGHT.extraTight,
    letterSpacing: FONT_SIZES.hero1 * -0.01,
  },
  hero2: {
    fontSize: FONT_SIZES.hero2,
    lineHeight: FONT_SIZES.hero2 * LINE_HEIGHT.tight,
    letterSpacing: FONT_SIZES.hero2 * -0.01,
  },
  h1: {
    fontSize: FONT_SIZES.h1,
    lineHeight: FONT_SIZES.h1 * LINE_HEIGHT.extraTight,
    letterSpacing: FONT_SIZES.h1 * -0.005,
  },
  h2: {
    fontSize: FONT_SIZES.h2,
    lineHeight: FONT_SIZES.h2 * LINE_HEIGHT.tight,
    letterSpacing: FONT_SIZES.h2 * -0.005,
  },
  h3: {
    fontSize: FONT_SIZES.h3,
    lineHeight: FONT_SIZES.h3 * LINE_HEIGHT.tight,
    letterSpacing: FONT_SIZES.h3 * -0.005,
  },

  large: {
    fontSize: FONT_SIZES.large,
    lineHeight: FONT_SIZES.large * LINE_HEIGHT.snug,
    letterSpacing: FONT_SIZES.large * 0,
  },
  body: {
    fontSize: FONT_SIZES.body,
    lineHeight: FONT_SIZES.body * LINE_HEIGHT.normal,
    letterSpacing: FONT_SIZES.body * 0,
  },
  small: {
    fontSize: FONT_SIZES.small,
    lineHeight: FONT_SIZES.small * LINE_HEIGHT.relaxed,
    letterSpacing: FONT_SIZES.small * 0,
  },
  xSmall: {
    fontSize: FONT_SIZES.xSmall,
    lineHeight: FONT_SIZES.xSmall * LINE_HEIGHT.extraRelaxed,
    letterSpacing: FONT_SIZES.xSmall * 0,
  },
  tiny: {
    fontSize: FONT_SIZES.tiny,
    lineHeight: FONT_SIZES.tiny * LINE_HEIGHT.relaxed,
    letterSpacing: FONT_SIZES.tiny * 0,
  },
} as const;