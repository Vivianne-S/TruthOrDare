/**
 * Confirmation modal for exiting the game. No button has red glow, Yes has green.
 */
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";

type ExitConfirmModalProps = {
  visible: boolean;
  onNo: () => void;
  onYes: () => void;
};

export function ExitConfirmModal({
  visible,
  onNo,
  onYes,
}: ExitConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onNo}>
        <View
          style={styles.content}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.title}>Exit game</Text>
          <Text style={styles.message}>
            Are you sure you want to close the game?
          </Text>
          <View style={styles.buttons}>
            <Pressable
              onPress={onNo}
              style={({ pressed }) => [
                styles.button,
                styles.buttonNo,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>No</Text>
            </Pressable>
            <Pressable
              onPress={onYes}
              style={({ pressed }) => [
                styles.button,
                styles.buttonYes,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Yes</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.x6,
  },
  content: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.x6,
    padding: SPACING.x6,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    width: "100%",
    maxWidth: 320,
  },
  title: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SPACING.x3,
  },
  message: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.x6,
  },
  buttons: {
    flexDirection: "row",
    gap: SPACING.x4,
    justifyContent: "center",
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.x3,
    paddingHorizontal: SPACING.x5,
    borderRadius: BORDER_RADIUS.x4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonNo: {
    backgroundColor: "rgba(255, 106, 174, 0.25)",
    borderWidth: 1.5,
    borderColor: COLORS.errorBorder,
    shadowColor: "#FF6AAE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonYes: {
    backgroundColor: "rgba(34, 197, 94, 0.25)",
    borderWidth: 1.5,
    borderColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textInverse,
    fontWeight: "700",
  },
});
