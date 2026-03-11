import { StyleSheet } from "react-native";

import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { FONT_FAMILY, TYPOGRAPHY_BASE } from "@/constants/theme/typography";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  screen: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: SPACING.x5,
    paddingBottom: SPACING.x8,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.x6,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(24, 4, 62, 0.52)",
    borderWidth: 1,
    borderColor: "rgba(245, 215, 255, 0.9)",
  },
  categoryLabel: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  headerText: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.x6,
  },
  avatarGlowRing: {
    width: 142,
    height: 142,
    borderRadius: 71,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 108, 228, 0.22)",
    shadowColor: "#FF5EDC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "rgba(255, 225, 255, 0.96)",
    overflow: "hidden",
    backgroundColor: "rgba(19, 62, 4, 0.9)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  playerName: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginTop: SPACING.x3,
  },
  choiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.x4,
    marginBottom: SPACING.x2,
  },
  cardPlaceholder: {
    marginTop: SPACING.x3,
    minHeight: 120,
    maxHeight: 160,
    borderRadius: BORDER_RADIUS.x6,
    borderWidth: 1.5,
    borderColor: "rgba(238, 199, 255, 0.9)",
    backgroundColor: "rgba(34, 9, 78, 0.72)",
    paddingHorizontal: SPACING.x4,
    paddingVertical: SPACING.x1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.x5,
  },
  questionRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.x3,
  },
  speakerButton: {
    paddingHorizontal: SPACING.x1,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  cardPlaceholderText: {
    flex: 1,
    ...TYPOGRAPHY_BASE.h3,
    fontFamily: FONT_FAMILY.primary.extraBold,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  cardPlaceholderHintText: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.x8,
  },
  footerButtonWrapper: {
    alignSelf: "center",
    shadowColor: "#FF4FD8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  footerButton: {
    flex: 1,
  },
});
