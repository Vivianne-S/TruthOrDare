/**
 * Main game screen: shows current player, TRUTH/DARE buttons, and question card.
 * Uses useGameSession for players/questions and useQuestionSpeech for TTS.
 * "Next player" advances the turn; TRUTH/DARE reveal a random question from the category.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { ExitConfirmModal } from "@/components/ui/ExitConfirmModal";
import { ExitMenuModal } from "@/components/ui/ExitMenuModal";
import { AVATARS } from "@/constants/avatars";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { FONT_FAMILY, TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useGameSession } from "@/hooks/use-game-session";
import { usePulseAnimation } from "@/hooks/use-pulse-animation";
import { useQuestionSpeech } from "@/hooks/use-question-speech";

export default function GameScreen() {
  const {
    currentPlayer,
    hasPlayers,
    nextPlayer,
    currentQuestion,
    categoryName,
    showTruth,
    showDare,
  } = useGameSession();

  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleDoorPress = () => setShowExitMenu(true);
  const handleExitGame = () => {
    setShowExitMenu(false);
    setShowExitConfirm(true);
  };

  const playerName = currentPlayer?.name;
  const avatarSource =
    currentPlayer && currentPlayer.avatarId >= 0
      ? AVATARS[currentPlayer.avatarId % AVATARS.length]
      : AVATARS[0];

  const hasQuestion = !!currentQuestion?.question_text;
  const questionText = hasQuestion
    ? currentQuestion.question_text
    : "Tap TRUTH or DARE to reveal a question.";

  const nextPlayerGlowStyle = usePulseAnimation(!!currentQuestion, {
    opacityRange: [0.7, 1],
    scaleRange: [1, 1.05],
  });

  const { speak } = useQuestionSpeech({
    text: currentQuestion?.question_text ?? null,
    enabled: isSpeechEnabled,
    language: "en-US",
  });

  return (
    <>
    <ImageBackground
      source={require("@/assets/images/game_background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.screen}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={handleDoorPress}
              accessibilityLabel="Meny för att avsluta eller gå tillbaka"
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={COLORS.textInverse}
              />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              {categoryName ? (
                <Text style={styles.categoryLabel}>{categoryName}</Text>
              ) : null}
              <Text style={styles.headerText}>
                {hasPlayers ? `It's ${playerName}'s turn!` : "Your turn!"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={() => setIsSpeechEnabled((prev) => !prev)}
              accessibilityLabel={
                isSpeechEnabled ? "Turn off speech" : "Turn on speech"
              }
            >
              <Ionicons
                name={isSpeechEnabled ? "volume-high" : "volume-mute"}
                size={20}
                color={COLORS.textInverse}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlowRing}>
              <View style={styles.avatarBorder}>
                <Image source={avatarSource} style={styles.avatarImage} />
              </View>
            </View>
            <Text style={styles.playerName}>{playerName}</Text>
          </View>

          <View style={styles.choiceRow}>
            <AppButton
              variant="truth"
              onPress={showTruth}
              disabled={!hasPlayers || !!currentQuestion}
            >
              TRUTH
            </AppButton>
            <AppButton
              variant="dare"
              onPress={showDare}
              disabled={!hasPlayers || !!currentQuestion}
            >
              DARE
            </AppButton>
          </View>

          <View style={styles.cardPlaceholder}>
            <View style={styles.questionRow}>
              <Text
                style={[
                  styles.cardPlaceholderText,
                  !hasQuestion && styles.cardPlaceholderHintText,
                ]}
              >
                {questionText}
              </Text>
              {currentQuestion?.question_text && isSpeechEnabled ? (
                <TouchableOpacity
                  onPress={speak}
                  style={styles.speakerButton}
                  accessibilityLabel="Read the question again"
                >
                  <Ionicons
                    name="volume-high"
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.footerRow}>
            <Animated.View
              style={[
                styles.footerButtonWrapper,
                currentQuestion ? nextPlayerGlowStyle : null,
              ]}
            >
              <AppButton
                variant="pill"
                size="small"
                style={styles.footerButton}
                onPress={nextPlayer}
                disabled={!hasPlayers}
              >
                Next player
              </AppButton>
            </Animated.View>
          </View>
        </View>
      </View>
    </ImageBackground>

    <ExitMenuModal
      visible={showExitMenu}
      onDismiss={() => setShowExitMenu(false)}
      onBackToCategories={() => {
        setShowExitMenu(false);
        router.replace("/categories");
      }}
      onAddMorePlayers={() => {
        setShowExitMenu(false);
        router.push("/add-players?addMore=true");
      }}
      onExitGame={handleExitGame}
    />
    <ExitConfirmModal
      visible={showExitConfirm}
      onNo={() => setShowExitConfirm(false)}
      onYes={() => {
        setShowExitConfirm(false);
        router.replace("/");
      }}
    />
    </>
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
    paddingTop: 72,
    paddingHorizontal: SPACING.x5,
    paddingBottom: SPACING.x8,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.x6,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
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
  categoryLabel: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  headerText: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.x6,
  },
  avatarGlowRing: {
    width: 142,
    height: 142,
    borderRadius: 71,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 108, 228, 0.22)",
    shadowColor: "#FF5EDC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "rgba(255, 225, 255, 0.96)",
    overflow: "hidden",
    backgroundColor: "rgba(19, 62, 4, 0.9)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  playerName: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginTop: SPACING.x3,
  },
  choiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.x4,
    marginBottom: SPACING.x2,
  },
  cardPlaceholder: {
    marginTop: SPACING.x3,
    minHeight: 120,
    maxHeight: 160,
    borderRadius: BORDER_RADIUS.x6,
    borderWidth: 1.5,
    borderColor: "rgba(238, 199, 255, 0.9)",
    backgroundColor: "rgba(34, 9, 78, 0.72)",
    paddingHorizontal: SPACING.x4,
    paddingVertical: SPACING.x1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.x5,
  },
  questionRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.x3,
  },
  speakerButton: {
    paddingHorizontal: SPACING.x1,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  cardPlaceholderText: {
    flex: 1,
    ...TYPOGRAPHY_BASE.h3,
    fontFamily: FONT_FAMILY.primary.extraBold,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  cardPlaceholderHintText: {
    ...TYPOGRAPHY_BASE.body,
    fontFamily: FONT_FAMILY.primary.regular,
    color: COLORS.textSecondary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.x8,
  },
  footerButtonWrapper: {
    alignSelf: "center",
    shadowColor: "#FF4FD8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  footerButton: {
    flex: 1,
  },
});
