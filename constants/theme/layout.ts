import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

// ===============================
// LAYOUT
// ===============================
export const LAYOUT = {
  // Screen dimensions
  screenWidth: width,
  screenHeight: height,

  // Device detection
  isSmallDevice: width < 375,
  isLargeDevice: width > 414,
  isTablet: width >= 744,

  // Padding options
  screenPaddingStatic: 16,
  screenPaddingPercent: width * 0.05,
  screenPaddingResponsive: Math.max(16, width * 0.05),

  // Max widths
  maxContentWidth: 600, // example value
} as const;