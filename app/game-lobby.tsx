/**
 * Multiplayer game lobby: host sees players and can start; players wait.
 */
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AVATARS } from "@/constants/avatars";
import { AppButton } from "@/components/ui/AppButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import {
  getRoomById,
  getRoomPlayers,
  roomPlayersToPlayers,
  subscribeToRoom,
  type GameRoom,
  type GameRoomPlayer,
} from "@/services/game-room";
import { setGameCategory, setGamePlayers } from "@/services/game-session";

export default function GameLobbyScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { roomId, isHost } = useLocalSearchParams<{
    roomId: string;
    isHost: string;
  }>();

  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GameRoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const hostMode = isHost === "true";

  useEffect(() => {
    if (!roomId) {
      router.replace("/game-mode-select");
      return;
    }

    let unsub: (() => void) | undefined;

    const init = async () => {
      try {
        const [roomData, roomPlayers] = await Promise.all([
          getRoomById(roomId),
          getRoomPlayers(roomId),
        ]);
        if (roomData) setRoom(roomData);
        setPlayers(roomPlayers);
      } catch (e) {
        console.error("Lobby init error:", e);
      } finally {
        setLoading(false);
      }
    };

    init();

    unsub = subscribeToRoom(
      roomId,
      async (r) => {
        setRoom(r);
        if (r.status === "playing" && r.category_id && r.category_name) {
          const roomPlayers = await getRoomPlayers(roomId);
          setGamePlayers(roomPlayersToPlayers(roomPlayers, r.host_user_id));
          const questions = (r.game_questions ?? []) as {
            type: string;
            question_text: string;
            question_text_sv?: string | null;
          }[];
          setGameCategory(r.category_id, r.category_name, questions);
          router.replace("/game");
        }
      },
      (p) => setPlayers(p)
    );

    return () => unsub?.();
  }, [roomId]);

  const handleStartGame = useCallback(async () => {
    if (!roomId || !hostMode) return;
    setStarting(true);
    try {
      router.replace({ pathname: "/categories", params: { roomId } });
    } finally {
      setStarting(false);
    }
  }, [roomId, hostMode]);

  const handleBack = () => {
    router.replace("/game-mode-select");
  };

  if (loading) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

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
              <Pressable onPress={handleBack} style={styles.iconCircle} hitSlop={8}>
                <Ionicons name="chevron-back" size={20} color={COLORS.textInverse} />
              </Pressable>
              <Text style={styles.headerTitle}>{t("lobby.title")}</Text>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          <View
            style={[
              styles.content,
              { paddingBottom: insets.bottom + SPACING.x8 },
            ]}
          >
            {hostMode && (
              <Text style={styles.hostBadge}>{t("lobby.youAreHost")}</Text>
            )}

            <Text style={styles.playersLabel}>{t("lobby.players")}</Text>
            <View style={styles.playerList}>
              {players.map((p) => (
                <View key={p.id} style={styles.playerRow}>
                  <Image
                    source={
                      AVATARS[
                        p.avatar_id >= 0 ? p.avatar_id % AVATARS.length : 0
                      ]
                    }
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                  <Text style={styles.playerName}>
                    {p.name || "Player"}
                  </Text>
                </View>
              ))}
            </View>

            {hostMode ? (
              <AppButton
                variant="cta"
                onPress={handleStartGame}
                disabled={starting || players.length < 2}
              >
                {starting ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  t("lobby.startGame")
                )}
              </AppButton>
            ) : (
              <Text style={styles.waitingText}>{t("lobby.waitingForHost")}</Text>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundPrimary,
  },
  screen: {
    flex: 1,
    paddingHorizontal: SPACING.x4,
  },
  header: { marginBottom: SPACING.x4 },
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
  headerSpacer: { width: 36, height: 36 },
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
    gap: SPACING.x5,
    paddingHorizontal: SPACING.x4,
  },
  hostBadge: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.secondary,
    textAlign: "center",
  },
  playersLabel: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  playerList: {
    flex: 1,
    gap: SPACING.x2,
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  playerName: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  waitingText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
