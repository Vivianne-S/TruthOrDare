import { Modal, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useI18n } from "@/context/I18nContext";

type OutOfQuestionsHostOverlayProps = {
  visible: boolean;
  /** Waiting for host to resolve deck / Oops (non-host pressed Next). */
  variant?: "hostInMenu" | "waitingForHostDeck";
};

export function OutOfQuestionsHostOverlay({
  visible,
  variant = "hostInMenu",
}: OutOfQuestionsHostOverlayProps) {
  const { t } = useI18n();
  const titleKey =
    variant === "waitingForHostDeck"
      ? "multiplayer.waitingForHostDeckTitle"
      : "multiplayer.hostInMenuTitle";
  const messageKey =
    variant === "waitingForHostDeck"
      ? "multiplayer.waitingForHostDeckMessage"
      : "multiplayer.hostInMenuMessage";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        // Block closing via Android back button.
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>{t(titleKey)}</Text>
          <Text style={styles.message}>{t(messageKey)}</Text>
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
    borderColor: "rgba(165, 107, 255, 0.5)",
    width: "100%",
    maxWidth: 340,
  },
  title: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: SPACING.x3,
  },
  message: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

