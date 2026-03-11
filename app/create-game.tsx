/**
 * Create game screen: creates a room, shows code and QR for others to join.
 * Placeholder – backend integration coming in Phase 2.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateRoomCode(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return result;
}

export default function CreateGameScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [roomCode] = useState(() => generateRoomCode(6));

  const joinUrl = useMemo(() => {
    // Placeholder – Phase 2: use actual app URL scheme or deep link
    return `truthordare://join/${roomCode}`;
  }, [roomCode]);

  const handleCopyCode = () => {
    // Placeholder – Phase 2: use expo-clipboard
    Alert.alert(t("createGame.comingSoonTitle"), t("createGame.comingSoonMessage"));
  };

  const handleStartGame = () => {
    // Placeholder – Phase 2: navigate to lobby or add-players with room context
    Alert.alert(t("createGame.comingSoonTitle"), t("createGame.comingSoonMessage"));
  };

  return (
    <ImageBackground
      source={require("@/assets/images/purple_galaxy.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerSpacer} />
              <LanguageSwitcher />
            </View>
            <View style={styles.headerBottomRow}>
              <Pressable
                onPress={() => router.back()}
                style={styles.iconCircle}
                hitSlop={8}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={COLORS.textInverse}
                />
              </Pressable>
              <Text style={styles.headerTitle}>{t("createGame.title")}</Text>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          <View
            style={[
              styles.content,
              { paddingBottom: insets.bottom + SPACING.x8 },
            ]}
          >
            <Text style={styles.subtitle}>{t("createGame.subtitle")}</Text>

            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>{t("createGame.roomCode")}</Text>
              <Text style={styles.codeValue}>{roomCode}</Text>
            </View>

            <View style={styles.qrContainer}>
              <QRCode
                value={joinUrl}
                size={180}
                color="#1a1a1a"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text style={styles.hint}>{t("createGame.hint")}</Text>

            <AppButton variant="glass" onPress={handleCopyCode}>
              {t("createGame.copyCode")}
            </AppButton>

            <AppButton variant="cta" onPress={handleStartGame}>
              {t("createGame.startGame")}
            </AppButton>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  screen: {
    flex: 1,
    paddingHorizontal: SPACING.x4,
  },
  header: {
    marginBottom: SPACING.x4,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: SPACING.x4,
    paddingBottom: SPACING.x1,
  },
  headerBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.x4,
    paddingBottom: SPACING.x2,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
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
  content: {
    flex: 1,
    gap: SPACING.x4,
    paddingHorizontal: SPACING.x4,
  },
  subtitle: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.x2,
  },
  codeCard: {
    backgroundColor: "rgba(138, 74, 255, 0.34)",
    borderWidth: 1.2,
    borderColor: "rgba(220, 181, 255, 0.8)",
    borderRadius: BORDER_RADIUS.x6,
    paddingVertical: SPACING.x5,
    paddingHorizontal: SPACING.x4,
    alignItems: "center",
  },
  codeLabel: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.x1,
  },
  codeValue: {
    ...TYPOGRAPHY_BASE.h1,
    color: COLORS.textPrimary,
    fontWeight: "700",
    letterSpacing: 6,
  },
  qrContainer: {
    alignItems: "center",
    padding: SPACING.x4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: BORDER_RADIUS.x5,
    alignSelf: "center",
  },
  hint: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
