/**
 * Menu modal shown when tapping the door icon. Offers "Back to categories" or "Exit Game".
 */
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";

type ExitMenuModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onBackToCategories: () => void;
  onAddMorePlayers: () => void;
  onExitGame: () => void;
};

export function ExitMenuModal({
  visible,
  onDismiss,
  onBackToCategories,
  onAddMorePlayers,
  onExitGame,
}: ExitMenuModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <View
          style={styles.contentWrapper}
          onStartShouldSetResponder={() => true}
        >
          <LinearGradient
            colors={[
              "rgba(58, 20, 90, 0.98)",
              "rgba(42, 12, 72, 0.98)",
              "rgba(30, 8, 58, 0.98)",
            ]}
            style={styles.content}
          >
            <View style={styles.header}>
              <Text style={styles.title}>End the round?</Text>
              <Text style={styles.subtitle}>
                Choose what you'd like to do.
              </Text>
            </View>

            <View style={styles.buttons}>
              <Pressable
                onPress={onBackToCategories}
                style={({ pressed }) => [
                  styles.optionButton,
                  styles.optionBack,
                  pressed && styles.optionPressed,
                ]}
              >
                <Ionicons
                  name="arrow-back-circle"
                  size={22}
                  color={COLORS.success}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Back to categories</Text>
              </Pressable>

              <Pressable
                onPress={onAddMorePlayers}
                style={({ pressed }) => [
                  styles.optionButton,
                  styles.optionAdd,
                  pressed && styles.optionPressed,
                ]}
              >
                <Ionicons
                  name="person-add"
                  size={22}
                  color={COLORS.primary}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Add more players</Text>
              </Pressable>

              <Pressable
                onPress={onExitGame}
                style={({ pressed }) => [
                  styles.optionButton,
                  styles.optionExit,
                  pressed && styles.optionPressed,
                ]}
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color={COLORS.error}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Exit Game</Text>
              </Pressable>
            </View>

            <Pressable onPress={onDismiss} style={styles.cancelTouch} hitSlop={12}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.x6,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BORDER_RADIUS.x6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(165, 107, 255, 0.35)",
    shadowColor: "#A56BFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  content: {
    padding: SPACING.x6,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.x5,
  },
  title: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: SPACING.x1,
  },
  subtitle: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  buttons: {
    gap: SPACING.x3,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.x4,
    paddingHorizontal: SPACING.x5,
    borderRadius: BORDER_RADIUS.x4,
    borderWidth: 1.5,
  },
  optionBack: {
    backgroundColor: COLORS.successSurface,
    borderColor: "rgba(121, 201, 255, 0.5)",
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  optionAdd: {
    backgroundColor: "rgba(165, 107, 255, 0.2)",
    borderColor: "rgba(165, 107, 255, 0.5)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  optionExit: {
    backgroundColor: COLORS.errorSurface,
    borderColor: "rgba(255, 106, 174, 0.5)",
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionIcon: {
    marginRight: SPACING.x3,
  },
  optionText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textInverse,
    fontWeight: "600",
  },
  cancelTouch: {
    alignSelf: "center",
    paddingVertical: SPACING.x3,
    paddingHorizontal: SPACING.x4,
    marginTop: SPACING.x3,
  },
  cancelText: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textDisabled,
  },
});
