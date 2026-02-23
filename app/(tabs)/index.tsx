import { Ionicons } from "@expo/vector-icons";
import {
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
  const { currentPlayer, hasPlayers, nextPlayer } = useGameSession();

  const playerName = currentPlayer?.name || "Player";
  const avatarSource =
    currentPlayer && currentPlayer.avatarId >= 0
      ? AVATARS[currentPlayer.avatarId % AVATARS.length]
      : AVATARS[0];

  return (
    <ImageBackground
      source={require("@/assets/images/purple_galaxy.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.screen}>
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={20} color={COLORS.textInverse} />
            </View>
            <Text style={styles.headerText}>
              {hasPlayers ? `It's ${playerName}'s turn!` : "Your turn!"}
            </Text>
            <View style={styles.iconCircle}>
              <Ionicons name="settings-outline" size={20} color={COLORS.textInverse} />
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
            <AppButton variant="truth">
              TRUTH
            </AppButton>
            <AppButton variant="dare">
              DARE
            </AppButton>
          </View>

          <View style={styles.cardPlaceholder}>
            <Text style={styles.cardPlaceholderText}>
              Question will appear here
            </Text>
          </View>

          <View style={styles.footerRow}>
            <AppButton
              variant="pill"
              size="small"
              style={styles.footerButton}
              onPress={nextPlayer}
              disabled={!hasPlayers}
            >
              Next player
            </AppButton>
            <AppButton
              variant="pill"
              size="small"
              style={styles.footerButton}
            >
              Pass
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
  headerText: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
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
    backgroundColor: "rgba(255, 108, 227, 0.48)",
    shadowColor: "#FF5EDC",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 40,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "rgba(255, 225, 255, 0.96)",
    overflow: "hidden",
    backgroundColor: "rgba(24, 4, 62, 0.9)",
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
    marginBottom: SPACING.x5,
  },
  cardPlaceholder: {
    minHeight: 120,
    maxHeight: 160,
    borderRadius: BORDER_RADIUS.x6,
    borderWidth: 1.5,
    borderColor: "rgba(238, 199, 255, 0.9)",
    backgroundColor: "rgba(34, 9, 78, 0.72)",
    padding: SPACING.x4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.x5,
  },
  cardPlaceholderText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.x4,
  },
  footerButton: {
    flex: 1,
  },
});
