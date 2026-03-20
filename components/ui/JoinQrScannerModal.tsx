/**
 * Full-screen QR scanner for joining a multiplayer room (same payload as host QR / deep link).
 */
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import {
  extractRoomCodeFromScanPayload,
  isValidRoomCodeLength,
} from "@/utils/room-code-from-scan";

type JoinQrScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onCode: (code: string) => void;
};

export function JoinQrScannerModal({
  visible,
  onClose,
  onCode,
}: JoinQrScannerModalProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const allowScanRef = useRef(true);

  useEffect(() => {
    if (visible) {
      allowScanRef.current = true;
    }
  }, [visible]);

  const resumeScanning = useCallback(() => {
    allowScanRef.current = true;
  }, []);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (!visible || !allowScanRef.current) return;
      allowScanRef.current = false;
      const code = extractRoomCodeFromScanPayload(result.data);
      if (!isValidRoomCodeLength(code)) {
        Alert.alert(t("joinGame.invalidCodeTitle"), t("joinGame.invalidQrMessage"), [
          { text: t("common.ok"), onPress: resumeScanning },
        ]);
        return;
      }
      onCode(code);
      onClose();
    },
    [visible, onCode, onClose, resumeScanning, t],
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.root}>
        {!permission ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.textPrimary} size="large" />
          </View>
        ) : !permission.granted ? (
          <View
            style={[
              styles.permissionBlock,
              {
                paddingTop: insets.top + SPACING.x4,
                paddingBottom: insets.bottom + SPACING.x4,
              },
            ]}
          >
            <Text style={styles.permissionTitle}>
              {t("joinGame.cameraPermissionTitle")}
            </Text>
            <Text style={styles.permissionBody}>
              {t("joinGame.cameraPermissionMessage")}
            </Text>
            <Pressable
              onPress={() => requestPermission()}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonLabel}>{t("joinGame.allowCamera")}</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonLabel}>{t("joinGame.cancelScan")}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cameraPane}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={handleBarcodeScanned}
            />
            <View
              pointerEvents="box-none"
              style={[
                styles.topBar,
                { paddingTop: insets.top + SPACING.x2, paddingHorizontal: SPACING.x4 },
              ]}
            >
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.iconCircle,
                  pressed && styles.iconCirclePressed,
                ]}
                hitSlop={12}
              >
                <Ionicons name="close" size={24} color={COLORS.textInverse} />
              </Pressable>
            </View>
            <View
              pointerEvents="none"
              style={[styles.hintPill, { marginBottom: insets.bottom + SPACING.x6 }]}
            >
              <Text style={styles.hintText}>{t("joinGame.scannerHint")}</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraPane: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(24, 4, 62, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(245, 215, 255, 0.85)",
  },
  iconCirclePressed: {
    opacity: 0.85,
  },
  hintPill: {
    position: "absolute",
    bottom: 0,
    left: SPACING.x4,
    right: SPACING.x4,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: BORDER_RADIUS.x5,
    paddingVertical: SPACING.x3,
    paddingHorizontal: SPACING.x4,
  },
  hintText: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  permissionBlock: {
    flex: 1,
    paddingHorizontal: SPACING.x6,
    justifyContent: "center",
    gap: SPACING.x4,
  },
  permissionTitle: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  permissionBody: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "rgba(138, 74, 255, 0.9)",
    borderRadius: BORDER_RADIUS.x5,
    paddingVertical: SPACING.x4,
    alignItems: "center",
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonLabel: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textInverse,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: SPACING.x3,
    alignItems: "center",
  },
  secondaryButtonPressed: {
    opacity: 0.8,
  },
  secondaryButtonLabel: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
  },
});
