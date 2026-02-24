import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { BlurTint, BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

export type AppButtonVariant =
  | "glass"
  | "cta"
  | "pill"
  | "chip"
  | "fab"
  | "arrowNeon"
  | "truth"
  | "dare";
type AppButtonSize = "large" | "small" | "icon" | "card";

export interface AppButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  blurAmount?: number;
  blurType?: "xlight" | "light" | "dark" | "extraDark" | "regular";
}

const getVariantPreset = (): Record<
  AppButtonVariant,
  {
    tint: BlurTint;
    intensity: number;
    containerStyle: StyleProp<ViewStyle>;
    blurStyle: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
    sizeStyle?: StyleProp<ViewStyle>;
    gradientColors?: [string, string, ...string[]];
    sizeOverride?: AppButtonSize;
  }
> => ({
  glass: {
    tint: "light",
    intensity: 45,
    containerStyle: styles.containerDefaultShadow,
    blurStyle: styles.blurGlass,
    textStyle: styles.textDefault,
  },
  cta: {
    tint: "light",
    intensity: 90,
    containerStyle: styles.containerGlowPink,
    blurStyle: styles.blurCta,
    textStyle: styles.textCta,
    sizeStyle: styles.sizeCta,
  },
  pill: {
    tint: "dark",
    intensity: 62,
    containerStyle: styles.containerGlowPurple,
    blurStyle: styles.blurPill,
    textStyle: styles.textPill,
    sizeStyle: styles.sizePill,
  },
  chip: {
    tint: "dark",
    intensity: 58,
    containerStyle: styles.containerSoft,
    blurStyle: styles.blurChip,
    textStyle: styles.textChip,
    sizeStyle: styles.sizeChip,
    sizeOverride: "large",
  },
  fab: {
    tint: "light",
    intensity: 76,
    containerStyle: styles.containerGlowPurple,
    blurStyle: styles.blurFab,
    textStyle: styles.textFab,
    sizeStyle: styles.sizeFab,
    sizeOverride: "icon",
  },
  arrowNeon: {
    tint: "dark",
    intensity: 62,
    containerStyle: styles.containerGlowPink,
    blurStyle: styles.blurArrowNeon,
    textStyle: styles.textFab,
    sizeStyle: styles.sizeArrowNeon,
    gradientColors: ["#8A3DFF", "#FF3FD5", "#FF9BF3"],
    sizeOverride: "icon",
  },
  truth: {
    tint: "dark",
    intensity: 70,
    containerStyle: styles.containerGlowBlue,
    blurStyle: styles.blurTruth,
    textStyle: styles.textTruth,
    sizeStyle: styles.sizeChoiceCard,
    sizeOverride: "card",
  },
  dare: {
    tint: "dark",
    intensity: 70,
    containerStyle: styles.containerGlowPink,
    blurStyle: styles.blurDare,
    textStyle: styles.textDare,
    sizeStyle: styles.sizeChoiceCard,
    sizeOverride: "card",
  },
});

const mapLegacyBlurTypeToTint = (
  blurType: AppButtonProps["blurType"],
): BlurTint => {
  if (blurType === "dark" || blurType === "extraDark") return "dark";
  if (blurType === "regular") return "default";
  return "light";
};

export const AppButton = ({
  children,
  variant = "glass",
  size = "large",
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textColor,
  blurAmount,
  blurType,
}: AppButtonProps) => {
  const preset = getVariantPreset()[variant];
  const resolvedSize = preset.sizeOverride ?? size;
  const tint = blurType ? mapLegacyBlurTypeToTint(blurType) : preset.tint;
  const intensity = Math.max(
    0,
    Math.min(100, blurAmount !== undefined ? blurAmount * 4 : preset.intensity),
  );

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator
          color={textColor || "#FFFFFF"}
          size="small"
          style={styles.spinner}
        />
      ) : (
        <>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

          {typeof children === "string" ? (
            <Text
              style={[
                styles.textBase,
                preset.textStyle,
                !textColor && styles.textWithShadow,
                textColor ? { color: textColor } : null,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}

          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </>
      )}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.containerBase,
        styles[`size_${resolvedSize}`],
        preset.sizeStyle,
        preset.containerStyle,
        pressed && !disabled && !loading ? styles.pressedContainer : null,
        disabled || loading ? styles.disabled : null,
        style,
      ]}
    >
      {({ pressed }) => (
        <BlurView
          tint={tint}
          intensity={intensity}
          experimentalBlurMethod="dimezisBlurView"
          style={[
            styles.blurBase,
            styles[`size_${resolvedSize}`],
            preset.sizeStyle,
            preset.blurStyle,
            pressed && !disabled && !loading ? styles.pressedBlur : null,
          ]}
        >
          {preset.gradientColors ? (
            <LinearGradient
              colors={preset.gradientColors}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientLayer}
            />
          ) : null}
          <View style={styles.overlay} />
          {buttonContent}
        </BlurView>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  containerBase: {
    borderRadius: BORDER_RADIUS.x6,
  },
  containerDefaultShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  containerSoft: {
    shadowColor: "#7B5CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 5,
  },
  containerGlowPink: {
    shadowColor: "#FF4FD8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 18,
    elevation: 10,
  },
  containerGlowPurple: {
    shadowColor: "#9E67FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.58,
    shadowRadius: 14,
    elevation: 8,
  },
  containerGlowBlue: {
    shadowColor: "#5A7BFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 8,
  },

  blurBase: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    overflow: "hidden",
  },
  blurGlass: {
    backgroundColor: "rgba(133, 74, 255, 0.16)",
  },
  blurCta: {
    backgroundColor: "rgba(255, 46, 159, 0.42)",
    borderColor: "rgba(255, 203, 248, 0.98)",
    borderWidth: 1.5,
  },
  blurPill: {
    backgroundColor: "rgba(138, 74, 255, 0.34)",
    borderColor: "rgba(220, 181, 255, 0.8)",
    borderWidth: 1.2,
  },
  blurChip: {
    backgroundColor: "rgba(126, 52, 227, 0.42)",
    borderColor: "rgba(220, 181, 255, 0.55)",
    justifyContent: "space-between",
  },
  blurFab: {
    backgroundColor: "rgba(145, 72, 255, 0.48)",
    borderColor: "rgba(214, 177, 255, 0.92)",
    borderWidth: 1.4,
  },
  blurArrowNeon: {
    backgroundColor: "rgba(255, 91, 221, 0.16)",
    borderColor: "rgba(255, 210, 248, 0.98)",
    borderWidth: 1.6,
  },
  blurTruth: {
    borderRadius: BORDER_RADIUS.x3,
    backgroundColor: "rgba(77, 109, 255, 0.3)",
    borderColor: "rgba(123, 178, 255, 0.98)",
    borderWidth: 1.4,
  },
  blurDare: {
    borderRadius: BORDER_RADIUS.x3,
    backgroundColor: "rgba(255, 76, 188, 0.32)",
    borderColor: "rgba(255, 175, 221, 0.98)",
    borderWidth: 1.4,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },

  size_large: {
    width: "100%",
    minHeight: 54,
    paddingVertical: SPACING.x3,
    paddingHorizontal: SPACING.x5,
  },
  size_small: {
    minHeight: 44,
    alignSelf: "flex-start",
    paddingVertical: SPACING.x3,
    paddingHorizontal: SPACING.x6,
  },
  size_icon: {
    width: 64,
    height: 64,
    minHeight: 64,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignSelf: "center",
  },
  size_card: {
    flex: 1,
    minWidth: 150,
    minHeight: 126,
    borderRadius: BORDER_RADIUS.x5,
    paddingVertical: SPACING.x4,
    paddingHorizontal: SPACING.x3,
  },

  sizeCta: {
    minHeight: 64,
    paddingVertical: SPACING.x4,
    borderRadius: BORDER_RADIUS.x12,
  },
  sizePill: {
    minWidth: 126,
    minHeight: 56,
    borderRadius: BORDER_RADIUS.x12,
  },
  sizeChip: {
    minHeight: 58,
    borderRadius: BORDER_RADIUS.x4,
    paddingHorizontal: SPACING.x4,
  },
  sizeFab: {
    width: 66,
    height: 66,
    minHeight: 66,
  },
  sizeArrowNeon: {
    width: 74,
    height: 74,
    minHeight: 74,
  },
  sizeChoiceCard: {
    minHeight: 136,
    borderRadius: BORDER_RADIUS.x3,
  },

  textBase: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  textDefault: {
    fontSize: 16,
  },
  textCta: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: COLORS.textInverse,
  },
  textPill: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  textChip: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
  },
  textFab: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "400",
  },
  textTruth: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  textDare: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  textWithShadow: {
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  iconLeft: {
    marginRight: SPACING.x2,
  },
  iconRight: {
    marginLeft: SPACING.x3,
  },
  pressedContainer: {
    transform: [{ scale: 0.98 }],
  },
  pressedBlur: {
    borderColor: "rgba(255, 255, 255, 0.98)",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  disabled: {
    opacity: 0.5,
  },
  spinner: {
    marginRight: SPACING.x2,
  },
});
