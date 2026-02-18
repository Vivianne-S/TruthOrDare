import { COLORS } from "../colors";
import { SPACING } from "../spacing";
import { FONT_FAMILY } from "./fontFamily";
import { FONT_SIZES } from "./fontSizes";
import { LINE_HEIGHT } from "./lineHeight";
import { TYPOGRAPHY_BASE } from "./typographyBase";

/**
 * Complete typography style variants with font family and color assignments.
 * 
 * Each variant is a semantic, ready-to-use text style combining:
 * - Base size from TYPOGRAPHY_BASE
 * - Font family from FONT_FAMILY
 * - Color from COLORS
 * 
 * Use these with AppText component via the `variant` prop or apply directly with StyleSheet.
 * 
 * @constant
 * @example
 * // With AppText component (recommended)
 * <AppText variant="screenTitle">Dashboard</AppText>
 * 
 * @example
 * // Direct usage
 * <Text style={TYPOGRAPHY.bodyText}>Regular body text</Text>
 * 
 * @example
 * // Creating a new variant
 * // Add to this object using the template pattern below
 */
export const TYPOGRAPHY = {
  // template: {
  //   ...TYPOGRAPHY_BASE.size,
  //   fontFamily: FONT_FAMILY.font.style,
  //   color: COLORS.color
  // },
  screenTitle: { 
    ...TYPOGRAPHY_BASE.h1,
    fontFamily: FONT_FAMILY.secondary.medium,
    color: COLORS.primary,
  },
  screenSubtitle: {
    ...TYPOGRAPHY_BASE.h3,
    fontFamily: FONT_FAMILY.secondary.medium,
    color: COLORS.primary,
  },
  cardTitle: {
    ...TYPOGRAPHY_BASE.h3,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.primary,
  },
  bodyText: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textPrimary,
  },
  bodyTextBold: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.textPrimary,
  },
  bodyTextLink: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.accent,
  },
  smallText: {
    ...TYPOGRAPHY_BASE.small,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textPrimary,
    marginBottom: FONT_SIZES.small,
  },
  smallTextBold: {
    ...TYPOGRAPHY_BASE.small,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.textPrimary,
  },
  largeText: {
    ...TYPOGRAPHY_BASE.large,
    fontFamily: FONT_FAMILY.primary.regular, 
    color: COLORS.textPrimary,
    marginBottom: FONT_SIZES.large,
  },
  largeTextBold: {
    ...TYPOGRAPHY_BASE.large,
    fontFamily: FONT_FAMILY.primary.semiBold,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.semiBold,
    fontSize: FONT_SIZES.large,
    lineHeight: FONT_SIZES.body * LINE_HEIGHT.snug,
    color: COLORS.textPrimary,
    marginTop: SPACING.x2,
    marginBottom: SPACING.x3,
  },
} as const;