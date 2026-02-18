/**
 * Standard typographic scale ratios used for harmonious font size relationships.
 *
 * Each value represents a multiplier applied to the base font size at each level.
 *
 * @enum {number}
 *
 * @example
 * TypeScale.MinorThird // 1.2 - Balanced scale, good for most interfaces
 * TypeScale.GoldenRatio // 1.618 - Classical proportion, dramatic contrast
 */
export enum TypeScale {
    MinorSecond = 1.067,
    MajorSecond = 1.125,
    MinorThird = 1.2,
    MajorThird = 1.25,
    PerfectFourth = 1.333,
    AugmentedFourth = 1.414,
    PerfectFifth = 1.5,
    GoldenRatio = 1.618,
  }
  
  /**
   * Calculates font size based on typographic scale level or normalizes pixel values to the scale.
   *
   * By default, returns whole pixels for consistent rendering. Set `round: false` for precise
   * decimal values when needed for calculations or specific design requirements.
   *
   * Positive levels use exponential typographic scaling, negative levels use linear scaling
   * (0.875, 0.75, 0.625) for more practical smaller text sizes.
   *
   * @param levelOrPx - The typographic level or pixel value to convert
   * @param options - Configuration options
   * @param options.isPx - If true, treats `levelOrPx` as pixels and rounds to nearest scale level
   * @param options.baseSize - Base font size in pixels. Default is 16
   * @param options.scale - Typographic scale ratio to use. Default is TypeScale.MinorThird (1.2)
   * @param options.round - If true, rounds result to whole pixels. Default is true
   * @returns The calculated font size in pixels (rounded or precise based on options)
   *
   * @example
   * // Using levels with default settings (base: 16px, scale: 1.2, rounded)
   * setFontSize(0)   // 16px - base size
   * setFontSize(2)   // 23px - heading (rounded from 23.04)
   * setFontSize(-1)  // 14px - smaller text
   *
   * @example
   * // Normalizing pixel values to scale
   * setFontSize(18, { isPx: true })  // Snaps to nearest level
   *
   * @example
   * // Precise decimal values
   * setFontSize(1, { round: false })  // 19.2px - exact value
   * setFontSize(2, { round: false })  // 23.04px - exact value
   *
   * @example
   * // Using different typographic scales
   * setFontSize(2, { scale: TypeScale.GoldenRatio })  // More dramatic
   * setFontSize(2, { scale: TypeScale.MajorSecond })  // More subtle
   *
   * @example
   * // Custom base size
   * setFontSize(1, { baseSize: 14 })  // 17px (14 * 1.2 rounded)
   */
  export const setFontSize = (
    levelOrPx: number,
    isPxOrOptions?:
      | boolean
      | {
          isPx?: boolean;
          baseSize?: number;
          scale?: TypeScale;
          round?: boolean;
        }
  ) => {
    const options =
      typeof isPxOrOptions === 'boolean'
        ? { isPx: isPxOrOptions }
        : isPxOrOptions;
  
    const base = options?.baseSize ?? 16;
    const typeScale = options?.scale ?? TypeScale.MinorThird;
    const shouldRound = options?.round ?? true;
  
    let result: number;
  
    if (options?.isPx) {
      const level = Math.log(levelOrPx / base) / Math.log(typeScale);
      result = base * Math.pow(typeScale, Math.round(level));
    } else if (levelOrPx < 0) {
      // Negative levels use linear scaling down
      const scales = [1, 0.875, 0.75, 0.625];
      const index = Math.abs(levelOrPx);
      const multiplier = scales[Math.min(index, scales.length - 1)] ?? 0.625;
      result = base * multiplier;
    } else {
      // Positive levels using typographic scale
      result = base * Math.pow(typeScale, levelOrPx);
    }
  
    return shouldRound ? Math.round(result) : result;
  };
  
  /**
   * Semantic font size scale using typographic progression.
   *
   * All sizes are calculated using the MinorThird scale (1.2) with a 16px base.
   * Negative levels use linear scaling for practical smaller text sizes.
   *
   * @constant
   *
   * @property {number} fs_050 - 10px - Minimum size for legal text
   * @property {number} fs_100 - 12px - Fine print, labels
   * @property {number} fs_200 - 14px - Small body text, captions
   * @property {number} fs_300 - 16px - Base body text
   * @property {number} fs_400 - 19px - Large body text
   * @property {number} fs_500 - 23px - Small headings
   * @property {number} fs_600 - 28px - Medium headings
   * @property {number} fs_700 - 33px - Large headings
   * @property {number} fs_800 - 40px - Extra large headings
   * @property {number} fs_900 - 48px - Hero text
   *
   * @property {number} hero1 - 48px - Primary hero text
   * @property {number} hero2 - 40px - Secondary hero text
   * @property {number} h1 - 33px - Top-level heading
   * @property {number} h2 - 28px - Section heading
   * @property {number} h3 - 23px - Subsection heading
   * @property {number} large - 19px - Large body text
   * @property {number} body - 16px - Standard body text
   * @property {number} small - 14px - Small text, captions
   * @property {number} xSmall - 12px - Extra small text, labels
   * @property {number} tiny - 10px - Minimum readable size
   *
   * @example
   * fontSize: FONT_SIZES.body    // 16px
   * fontSize: FONT_SIZES.h2      // 28px
   * fontSize: FONT_SIZES.small   // 14px
   */
  export const FONT_SIZES = {
    fs_050: setFontSize(-3), // 10 @ TypeScale MinorThird (1.2)
    fs_100: setFontSize(-2), // 12 @ TypeScale MinorThird (1.2)
    fs_200: setFontSize(-1), // 14 @ TypeScale MinorThird (1.2)
    fs_300: setFontSize(0), // 16 @ TypeScale MinorThird (1.2)
    fs_400: setFontSize(1), // 19 @ TypeScale MinorThird (1.2)
    fs_500: setFontSize(2), // 23 @ TypeScale MinorThird (1.2)
    fs_600: setFontSize(3), // 28 @ TypeScale MinorThird (1.2)
    fs_700: setFontSize(4), // 33 @ TypeScale MinorThird (1.2)
    fs_800: setFontSize(5), // 40 @ TypeScale MinorThird (1.2)
    fs_900: setFontSize(6), // 48 @ TypeScale MinorThird (1.2)
  
    // Large text
    hero1: setFontSize(6),
    hero2: setFontSize(5),
    h1: setFontSize(4),
    h2: setFontSize(3),
    h3: setFontSize(2),
  
    // Body text
    large: setFontSize(1),
    body: setFontSize(0),
    small: setFontSize(-1),
    xSmall: setFontSize(-2),
    tiny: setFontSize(-3),
  } as const;