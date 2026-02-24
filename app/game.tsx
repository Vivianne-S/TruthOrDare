import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AVATARS } from "@/constants/avatars";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useGameSession } from "@/hooks/use-game-session";

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

  const playerName = currentPlayer?.name || "Player";
  const avatarSource =
    currentPlayer && currentPlayer.avatarId >= 0
      ? AVATARS[currentPlayer.avatarId % AVATARS.length]
      : AVATARS[0];

  const questionLabel = currentQuestion?.type?.toUpperCase() ?? "TRUTH OR DARE";
  const questionText =
    currentQuestion?.question_text ??
    "Tap TRUTH or DARE to reveal a question.";

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;

    if (currentQuestion) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      pulse.setValue(0);
    }

    return () => {
      if (loop) loop.stop();
    };
  }, [currentQuestion, pulse]);

  const nextPlayerGlowStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  return (
    <ImageBackground
      source={require("@/assets/images/game_background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.screen}>
          <View style={styles.headerRow}>
            <View style={styles.headerSide} />
            <View style={styles.headerCenter}>
              {categoryName ? (
                <Text style={styles.categoryLabel}>{categoryName}</Text>
              ) : null}
              <Text style={styles.headerText}>
                {hasPlayers ? `It's ${playerName}'s turn!` : "Your turn!"}
              </Text>
            </View>
            <View style={styles.iconCircle}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={COLORS.textInverse}
              />
            </View>
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
            <Text style={styles.cardLabel}>{questionLabel}</Text>
            <Text style={styles.cardPlaceholderText}>{questionText}</Text>
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
  headerSide: {
    width: 36,
    height: 36,
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
  cardLabel: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.x2,
  },
  cardPlaceholderText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    textAlign: "center",
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
