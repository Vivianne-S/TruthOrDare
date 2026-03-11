/**
 * Join game screen: enter room code, name, and avatar to join an existing game.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { AvatarPickerButton } from "@/components/ui/AvatarPickerButton";
import { AvatarPickerModal } from "@/components/ui/AvatarPickerModal";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { UNSELECTED_AVATAR } from "@/types/player";
import { joinGameRoom } from "@/services/game-room";

const CODE_LENGTH = 6;

export default function JoinGameScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(UNSELECTED_AVATAR);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== CODE_LENGTH) {
      Alert.alert(
        t("joinGame.invalidCodeTitle"),
        t("joinGame.invalidCodeMessage")
      );
      return;
    }
    setJoining(true);
    try {
      const { room } = await joinGameRoom(
        trimmed,
        name.trim() || "Player",
        avatarId >= 0 ? avatarId : 0
      );
      router.replace({
        pathname: "/game-lobby",
        params: { roomId: room.id, isHost: "false" },
      });
    } catch (e) {
      Alert.alert(
        t("joinGame.roomNotFound"),
        t("joinGame.roomNotFoundMessage")
      );
    } finally {
      setJoining(false);
    }
  };

  const handleScanQR = () => {
    Alert.alert(t("joinGame.comingSoonTitle"), t("joinGame.comingSoonMessage"));
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
              <Text style={styles.headerTitle}>{t("joinGame.title")}</Text>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          <View
            style={[
              styles.content,
              { paddingBottom: insets.bottom + SPACING.x8 },
            ]}
          >
            <Text style={styles.subtitle}>{t("joinGame.subtitle")}</Text>

            <View style={styles.playerRow}>
              <AvatarPickerButton
                avatarId={avatarId}
                onPress={() => setShowAvatarPicker(true)}
              />
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder={t("joinGame.yourName")}
                placeholderTextColor={COLORS.textDisabled}
                autoCapitalize="words"
              />
            </View>

            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(text) =>
                setCode(text.replace(/[^a-zA-Z0-9]/g, "").slice(0, CODE_LENGTH).toUpperCase())
              }
              placeholder={t("joinGame.codePlaceholder")}
              placeholderTextColor={COLORS.textDisabled}
              maxLength={CODE_LENGTH}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <AppButton
              variant="cta"
              onPress={handleJoin}
              disabled={joining}
            >
              {joining ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                t("joinGame.join")
              )}
            </AppButton>

            <AppButton variant="glass" onPress={handleScanQR}>
              {t("joinGame.scanQR")}
            </AppButton>
          </View>
        </View>
      </View>

      {showAvatarPicker && (
        <AvatarPickerModal
          visible={true}
          selectedId={avatarId >= 0 ? avatarId : 0}
          onSelect={(id) => {
            setAvatarId(id);
            setShowAvatarPicker(false);
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
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
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.x3,
    backgroundColor: "rgba(138, 74, 255, 0.34)",
    borderWidth: 1.2,
    borderColor: "rgba(220, 181, 255, 0.8)",
    borderRadius: BORDER_RADIUS.x6,
    paddingHorizontal: SPACING.x4,
    paddingVertical: SPACING.x3,
  },
  nameInput: {
    flex: 1,
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.x2,
  },
  codeInput: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    backgroundColor: "rgba(138, 74, 255, 0.34)",
    borderWidth: 1.2,
    borderColor: "rgba(220, 181, 255, 0.8)",
    borderRadius: BORDER_RADIUS.x6,
    paddingHorizontal: SPACING.x5,
    paddingVertical: SPACING.x4,
    textAlign: "center",
    letterSpacing: 4,
  },
});
