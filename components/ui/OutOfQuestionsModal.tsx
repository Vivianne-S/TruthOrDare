/**
 * Modal shown when the current category has run out of Truth or Dare questions.
 * UI-only for now (purchase flow comes later).
 */
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useI18n } from "@/context/I18nContext";

type OutOfQuestionsModalProps = {
  visible: boolean;
  /** At least one card still in truth or dare pool — user can keep playing that side only */
  canContinue?: boolean;
  onContinue?: () => void;
  onBuyMore: () => void;
  onFinish: () => void;
};

export function OutOfQuestionsModal({
  visible,
  canContinue = false,
  onContinue,
  onBuyMore,
  onFinish,
}: OutOfQuestionsModalProps) {
  const { t } = useI18n();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        // Intentionally block closing via Android back button.
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Ionicons
              name="alert-circle"
              size={28}
              color={COLORS.warning}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>{t("outOfQuestions.title")}</Text>
          </View>
          <Text style={styles.message}>{t("outOfQuestions.message")}</Text>

          <View style={styles.buttonColumn}>
            {canContinue && onContinue ? (
              <Pressable
                onPress={onContinue}
                style={({ pressed }) => [
                  styles.buttonBase,
                  styles.buttonContinue,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonTextContinue}>
                  {t("outOfQuestions.continueGame")}
                </Text>
              </Pressable>
            ) : null}
            <View style={styles.buttons}>
              <Pressable
                onPress={onBuyMore}
                style={({ pressed }) => [
                  styles.buttonBase,
                  styles.buttonRow,
                  styles.buttonBuy,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>
                  {t("outOfQuestions.buyMore")}
                </Text>
              </Pressable>
              <Pressable
                onPress={onFinish}
                style={({ pressed }) => [
                  styles.buttonBase,
                  styles.buttonRow,
                  styles.buttonFinish,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>
                  {t("outOfQuestions.finish")}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.x6,
  },
  content: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.x6,
    padding: SPACING.x6,
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.35)",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: SPACING.x3,
  },
  headerIcon: {
    marginBottom: SPACING.x3,
  },
  title: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.x6,
  },
  buttonColumn: {
    width: "100%",
    gap: SPACING.x3,
  },
  buttons: {
    flexDirection: "row",
    gap: SPACING.x3,
    justifyContent: "center",
  },
  buttonBase: {
    paddingVertical: SPACING.x3,
    paddingHorizontal: SPACING.x4,
    borderRadius: BORDER_RADIUS.x4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  buttonRow: {
    flex: 1,
  },
  buttonContinue: {
    alignSelf: "stretch",
    width: "100%",
    minHeight: 50,
    backgroundColor: "rgba(56, 189, 248, 0.28)",
    borderColor: "rgba(125, 211, 252, 0.95)",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonBuy: {
    backgroundColor: "rgba(165, 107, 255, 0.22)",
    borderColor: "rgba(165, 107, 255, 0.6)",
    shadowColor: "#A56BFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonFinish: {
    backgroundColor: "rgba(34, 197, 94, 0.22)",
    borderColor: "rgba(34, 197, 94, 0.85)",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textInverse,
    fontWeight: "800",
    textAlign: "center",
  },
  buttonTextContinue: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.infoText,
    fontWeight: "800",
    textAlign: "center",
  },
});

