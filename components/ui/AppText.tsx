import { COLORS } from '../../constants/theme/colors';
import { setSpacing } from '../../constants/theme/spacing';
import React, { ReactNode } from 'react';
import { Text, TextStyle, View } from 'react-native';

const FONT_FAMILY = {
  primary: {
    regular: 'System',
    semiBold: 'System',
    bold: 'System',
    extraBold: 'System',
  },
  secondary: {
    regular: 'serif',
    semiBold: 'serif',
    bold: 'serif',
    extraBold: 'serif',
  },
} as const;

const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

const TYPOGRAPHY_BASE = {
  caption: { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  body: { fontSize: 16, lineHeight: 22, letterSpacing: 0 },
  large: { fontSize: 18, lineHeight: 24, letterSpacing: 0 },
  h2: { fontSize: 24, lineHeight: 30, letterSpacing: 0 },
  h1: { fontSize: 30, lineHeight: 36, letterSpacing: 0 },
} as const;

const TYPOGRAPHY = {
  screenTitle: {
    fontFamily: FONT_FAMILY.primary.bold,
    fontSize: TYPOGRAPHY_BASE.h1.fontSize,
    lineHeight: TYPOGRAPHY_BASE.h1.lineHeight,
    letterSpacing: TYPOGRAPHY_BASE.h1.letterSpacing,
    color: COLORS.textPrimary,
  },
  bodyText: {
    fontFamily: FONT_FAMILY.primary.regular,
    fontSize: TYPOGRAPHY_BASE.body.fontSize,
    lineHeight: TYPOGRAPHY_BASE.body.lineHeight,
    letterSpacing: TYPOGRAPHY_BASE.body.letterSpacing,
    color: COLORS.textPrimary,
  },
} as const;

// Extract valid values from theme objects for type safety.
type StyleVariant = keyof typeof TYPOGRAPHY;
type FontFamily = keyof typeof FONT_FAMILY;
type FontWeight = keyof typeof FONT_FAMILY.primary;
type FontSize = keyof typeof TYPOGRAPHY_BASE;
type LineHeight = keyof typeof LINE_HEIGHT;
  
interface AppTextProps {
    // Typography
    variant?: StyleVariant;
    family?: FontFamily;
    weight?: FontWeight;
    size?: FontSize;
    lineHeight?: LineHeight | 'auto';
    letterSpacing?: 'auto' | number;
  
    // Style
    color?: string;
    textTransform?: TextStyle['textTransform'];
    align?: TextStyle['textAlign'];
  
    // Spacing
    spacingTop?: number;
    spacingBottom?: number;
    indent?: number;
  
    // Behavior
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  
    // Overrides
    style?: TextStyle;
    children: ReactNode;
}
  
  /**
   * Styled text component with consistent typography from the theme system.
   *
   * Supports two usage modes:
   * 1. Variant mode: Use predefined TYPOGRAPHY presets (e.g., 'screenTitle', 'bodyText')
   * 2. Custom mode: Build typography from individual props (family, weight, size)
   *
   * Priority order (lowest to highest):
   * - variant (complete preset from TYPOGRAPHY)
   * - individual props (family, weight, size, color, lineHeight, letterSpacing)
   * - style prop (full override)
   *
   * @component
   * @param props.variant - Complete typography preset from TYPOGRAPHY (includes font, size, color, spacing)
   * @param props.family - Font family: 'primary' (Inter) or 'secondary' (Roboto Serif). Default: 'primary'
   * @param props.weight - Font weight from regular to extraBold. Default: 'regular'
   * @param props.size - Font size from TYPOGRAPHY_BASE scale. Default: 'body'
   * @param props.lineHeight - Line height variant or 'auto' for preset/base default. Default: 'auto'
   * @param props.letterSpacing - Letter spacing multiplier (-0.01 = -1%) or 'auto' for preset/base default. Default: 'auto'
   * @param props.color - Text color. Overrides variant color if provided. Default: COLORS.textPrimary
   * @param props.textTransform - Text transformation: 'none', 'uppercase', 'lowercase', 'capitalize'
   * @param props.align - Text alignment: 'left', 'center', 'right', 'justify'
   * @param props.spacingTop - Top margin in 4px increments (1 = 4px, 2 = 8px, 3 = 12px, etc.)
   * @param props.spacingBottom - Bottom margin in 4px increments (1 = 4px, 2 = 8px, 3 = 12px, etc.)
   * @param props.indent - Left padding in 4px increments (1 = 4px, 2 = 8px, 3 = 12px, etc.)
   * @param props.numberOfLines - Maximum number of lines before truncation
   * @param props.ellipsizeMode - Truncation position when numberOfLines is set
   * @param props.style - Custom TextStyle that overrides all computed styles
   *
   * @example
   * // Using a complete variant preset
   * <AppText variant="screenTitle">Dashboard</AppText>
   *
   * @example
   * // Variant with color override
   * <AppText variant="bodyText" color={COLORS.accent}>
   *   Highlighted body text
   * </AppText>
   *
   * @example
   * // Custom typography without variant
   * <AppText family="secondary" weight="semiBold" size="h1">
   *   Custom Heading
   * </AppText>
   *
   * @example
   * // Custom with adjusted spacing (2 = 8px top, 3 = 12px bottom)
   * <AppText size="large" weight="bold" lineHeight="tight" spacingTop={2} spacingBottom={3}>
   *   Text with vertical spacing
   * </AppText>
   *
   * @example
   * // Indented paragraph (4 = 16px left padding)
   * <AppText indent={4} spacingBottom={2}>
   *   This paragraph has an indent at the start.
   * </AppText>
   *
   * @example
   * // Large spacing (10 = 40px)
   * <AppText spacingTop={10} spacingBottom={10}>
   *   Text with large vertical spacing
   * </AppText>
   *
   * @example
   * // Truncated text
   * <AppText numberOfLines={2} ellipsizeMode="tail">
   *   Long text that will be truncated after two lines...
   * </AppText>
   */
export const AppText = ({
    variant,
    family = 'primary',
    weight = 'regular',
    size = 'body',
    lineHeight = 'auto',
    letterSpacing = 'auto',
    color,
    textTransform = 'none',
    align = 'left',
    spacingTop = 0,
    spacingBottom = 0,
    indent = 0,
    numberOfLines,
    ellipsizeMode,
    style,
    children,
}: AppTextProps) => {
  const variantStyles = variant ? TYPOGRAPHY[variant] : null;
  
  // Variant or manual construction
  const fontFamily = variantStyles?.fontFamily || FONT_FAMILY[family][weight];
  const fontSize = variantStyles?.fontSize || TYPOGRAPHY_BASE[size].fontSize;
  
  const baseLineHeight =
    variantStyles?.lineHeight || TYPOGRAPHY_BASE[size].lineHeight;
  const baseLetterSpacing =
    variantStyles?.letterSpacing || TYPOGRAPHY_BASE[size].letterSpacing;
  
  // Calculate lineHeight
  const calculatedLineHeight =
    lineHeight === 'auto' ? baseLineHeight : fontSize * LINE_HEIGHT[lineHeight];
  
  // Calculate letter spacing
  const calculatedLetterSpacing =
    letterSpacing === 'auto' ? baseLetterSpacing : fontSize * letterSpacing;
  
  const effectiveColor = color || variantStyles?.color || COLORS.textPrimary;
  
  // Calculate spacing values
  const marginTop = spacingTop !== 0 ? setSpacing(spacingTop) : undefined;
  const marginBottom =
    spacingBottom !== 0 ? setSpacing(spacingBottom) : undefined;
  const paddingLeft = indent !== 0 ? setSpacing(indent) : undefined;
  
  const textContent = (
    <Text
      style={[
        {
          fontFamily,
          fontSize,
          lineHeight: calculatedLineHeight,
          letterSpacing: calculatedLetterSpacing,
          color: effectiveColor,
          textTransform,
          textAlign: align,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
  
  // If we need spacing or indent, wrap in View
  if (marginTop || marginBottom || paddingLeft) {
    return (
      <View
        style={{
          marginTop,
          marginBottom,
          paddingLeft,
        }}
      >
        {textContent}
      </View>
    );
  }
  
  // Otherwise return Text directly
  return textContent;
};
  