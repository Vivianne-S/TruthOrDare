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
import { COLORS } from "@/constants/theme/colors";
import type { GameAwards } from "@/types/game";
import type { Player } from "@/types/player";

import { styles } from "./styles";

const AVATAR_GLOW_COLORS = ["#FF4FD8", "#79C9FF", "#A56BFF"];

type GameOverScreenProps = {
  players: Player[];
  awards: GameAwards;
  onPlayAgain: () => void;
};

export function GameOverScreen({
  players,
  awards,
  onPlayAgain,
}: GameOverScreenProps) {
  const handleNewGame = () => router.replace("/add-players?newGame=true");
  const handleExit = () => router.replace("/");

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
            <Text style={styles.title}>GAME OVER</Text>
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
                <Text style={styles.awardLabel}>Dare Devil</Text>
                <Text style={styles.awardSubtitle}>Player with most dares</Text>
                <Text
                  style={[
                    styles.awardName,
                    !awards.mostDaring && styles.awardNameEmpty,
                  ]}
                >
                  {awards.mostDaring?.name ?? "–"}
                </Text>
              </View>
            </View>
            <View style={styles.awardCard}>
              <View style={[styles.awardIconBg, styles.awardIconHappy]}>
                <Ionicons name="happy" size={20} color="#FFF" />
              </View>
              <View style={styles.awardContent}>
                <Text style={styles.awardLabel}>Truthful Angel</Text>
                <Text style={styles.awardSubtitle}>Player with most truths</Text>
                <Text
                  style={[
                    styles.awardName,
                    !awards.truthfulAngel && styles.awardNameEmpty,
                  ]}
                >
                  {awards.truthfulAngel?.name ?? "–"}
                </Text>
              </View>
            </View>
            <View style={styles.awardCard}>
              <View style={[styles.awardIconBg, styles.awardIconTrophy]}>
                <Ionicons name="trophy" size={20} color="#FFF" />
              </View>
              <View style={styles.awardContent}>
                <Text style={styles.awardLabel}>Best of Both Worlds</Text>
                <Text style={styles.awardSubtitle}>
                  Most combined truths and dares
                </Text>
                <Text
                  style={[
                    styles.awardName,
                    !awards.superstar && styles.awardNameEmpty,
                  ]}
                >
                  {awards.superstar?.name ?? "–"}
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
                Play Again
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
                <Text style={styles.secondaryButtonText}>New Game</Text>
              </Pressable>
              <Pressable
                onPress={handleExit}
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
                <Text style={styles.secondaryButtonText}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}
