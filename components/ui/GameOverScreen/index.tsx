/**
 * Game Over screen shown when all questions are exhausted.
 * Displays awards (Dare Devil, Truthful Angel, Best of Both Worlds) and action buttons.
 */
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AVATARS } from "@/constants/avatars";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import type { GameAwards } from "@/types/game";
import type { Player } from "@/types/player";

import { styles } from "./styles";

const AVATAR_GLOW_COLORS = ["#FF4FD8", "#79C9FF", "#A56BFF"];

type GameOverScreenProps = {
  players: Player[];
  awards: GameAwards;
  onPlayAgain: () => void;
  onExitPress: () => void;
};

export function GameOverScreen({
  players,
  awards,
  onPlayAgain,
  onExitPress,
}: GameOverScreenProps) {
  const { t } = useI18n();
  const handleNewGame = () => router.replace("/add-players?newGame=true");

  const displayPlayers = players.slice(0, 3);

  return (
    <ImageBackground
      source={require("@/assets/images/game_background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <LinearGradient
        colors={[
          "rgba(20, 6, 43, 0.4)",
          "rgba(20, 6, 43, 0.6)",
          "rgba(20, 6, 43, 0.5)",
        ]}
        style={styles.overlay}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{t("gameOver.title")}</Text>
            <View style={styles.titleGlow} />
          </View>

          <View style={styles.avatarRow}>
            {displayPlayers.map((player, index) => (
              <View key={player.id} style={styles.avatarWrapper}>
                <View
                  style={[
                    styles.avatarGlow,
                    {
                      borderColor: AVATAR_GLOW_COLORS[index % 3] + "99",
                      shadowColor: AVATAR_GLOW_COLORS[index % 3],
                    },
                  ]}
                >
                  <Image
                    source={
                      player.avatarId >= 0
                        ? AVATARS[player.avatarId % AVATARS.length]
                        : AVATARS[0]
                    }
                    style={styles.avatar}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.awardsSection}>
            <View style={styles.awardCard}>
              <View style={[styles.awardIconBg, styles.awardIconFlame]}>
                <Ionicons name="flame" size={20} color="#FFF" />
              </View>
              <View style={styles.awardContent}>
                <Text style={styles.awardLabel}>{t("gameOver.dareDevil")}</Text>
                <Text style={styles.awardSubtitle}>{t("gameOver.dareDevilSubtitle")}</Text>
                <Text
                  style={[
                    styles.awardName,
                    !awards.mostDaring && styles.awardNameEmpty,
                  ]}
                >
                  {awards.mostDaring?.name ?? t("gameOver.noWinner")}
                </Text>
              </View>
            </View>
            <View style={styles.awardCard}>
              <View style={[styles.awardIconBg, styles.awardIconHappy]}>
                <Ionicons name="happy" size={20} color="#FFF" />
              </View>
              <View style={styles.awardContent}>
                <Text style={styles.awardLabel}>{t("gameOver.truthfulAngel")}</Text>
                <Text style={styles.awardSubtitle}>{t("gameOver.truthfulAngelSubtitle")}</Text>
                <Text
                  style={[
                    styles.awardName,
                    !awards.truthfulAngel && styles.awardNameEmpty,
                  ]}
                >
                  {awards.truthfulAngel?.name ?? t("gameOver.noWinner")}
                </Text>
              </View>
            </View>
            <View style={styles.awardCard}>
              <View style={[styles.awardIconBg, styles.awardIconTrophy]}>
                <Ionicons name="trophy" size={20} color="#FFF" />
              </View>
              <View style={styles.awardContent}>
                <Text style={styles.awardLabel}>{t("gameOver.bestOfBoth")}</Text>
                <Text style={styles.awardSubtitle}>
                  {t("gameOver.bestOfBothSubtitle")}
                </Text>
                <Text
                  style={[
                    styles.awardName,
                    !awards.superstar && styles.awardNameEmpty,
                  ]}
                >
                  {awards.superstar?.name ?? t("gameOver.noWinner")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonsSection}>
            <View style={styles.playAgainWrapper}>
              <AppButton
                variant="cta"
                onPress={onPlayAgain}
                style={styles.playAgainButton}
              >
                {t("gameOver.playAgain")}
              </AppButton>
            </View>
            <View style={styles.secondaryRow}>
              <Pressable
                onPress={handleNewGame}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  styles.newGameButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={COLORS.success}
                  style={styles.secondaryIcon}
                />
                <Text style={styles.secondaryButtonText}>{t("gameOver.newGame")}</Text>
              </Pressable>
              <Pressable
                onPress={onExitPress}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  styles.exitButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons
                  name="exit-outline"
                  size={24}
                  color={COLORS.error}
                  style={styles.secondaryIcon}
                />
                <Text style={styles.secondaryButtonText}>{t("gameOver.exit")}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}
