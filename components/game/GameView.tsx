/**
 * Main game view: current player, TRUTH/DARE buttons, question card.
 */
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AVATARS } from "@/constants/avatars";
import { translateCategoryName } from "@/i18n";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { usePulseAnimation } from "@/hooks/use-pulse-animation";
import { useQuestionSpeech } from "@/hooks/use-question-speech";
import type { Question } from "@/types/category";
import type { Player } from "@/types/player";

import { styles } from "./GameView.styles";

type GameViewProps = {
  currentPlayer: Player | null;
  categoryName: string | null;
  currentQuestion: Question | null;
  hasPlayers: boolean;
  isSpeechEnabled: boolean;
  onToggleSpeech: () => void;
  onDoorPress: () => void;
  onShowTruth: () => void;
  onShowDare: () => void;
  onNextPlayer: () => void;
};

export function GameView({
  currentPlayer,
  categoryName,
  currentQuestion,
  hasPlayers,
  isSpeechEnabled,
  onToggleSpeech,
  onDoorPress,
  onShowTruth,
  onShowDare,
  onNextPlayer,
}: GameViewProps) {
  const { t, locale } = useI18n();
  const displayedQuestionText = currentQuestion
    ? (locale === "sv" && currentQuestion.question_text_sv?.trim()
        ? currentQuestion.question_text_sv
        : currentQuestion.question_text)
    : null;
  const playerName = currentPlayer?.name;
  const avatarSource =
    currentPlayer && currentPlayer.avatarId >= 0
      ? AVATARS[currentPlayer.avatarId % AVATARS.length]
      : AVATARS[0];

  const hasQuestion = !!displayedQuestionText;
  const questionText = hasQuestion
    ? displayedQuestionText
    : t("game.tapToReveal");

  const nextPlayerGlowStyle = usePulseAnimation(!!currentQuestion, {
    opacityRange: [0.7, 1],
    scaleRange: [1, 1.05],
  });

  const speechLocale = locale === "sv" ? "sv-SE" : "en-US";
  const { speak } = useQuestionSpeech({
    text: displayedQuestionText ?? null,
    enabled: isSpeechEnabled,
    language: speechLocale,
  });

  return (
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
              onPress={onDoorPress}
              accessibilityLabel={t("game.exitMenuA11y")}
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={COLORS.textInverse}
              />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              {categoryName ? (
                <Text style={styles.categoryLabel}>{translateCategoryName(categoryName, t)}</Text>
              ) : null}
              <Text style={styles.headerText}>
                {hasPlayers ? t("game.playersTurn", { name: playerName ?? "" }) : t("game.yourTurn")}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconCircle}
              onPress={onToggleSpeech}
              accessibilityLabel={
                isSpeechEnabled ? t("game.turnOffSpeech") : t("game.turnOnSpeech")
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
              onPress={onShowTruth}
              disabled={!hasPlayers || !!currentQuestion}
            >
              {t("game.truth")}
            </AppButton>
            <AppButton
              variant="dare"
              onPress={onShowDare}
              disabled={!hasPlayers || !!currentQuestion}
            >
              {t("game.dare")}
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
              {displayedQuestionText && isSpeechEnabled ? (
                <TouchableOpacity
                  onPress={speak}
                  style={styles.speakerButton}
                  accessibilityLabel={t("game.readAgain")}
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
                onPress={onNextPlayer}
                disabled={!hasPlayers}
              >
                {t("game.nextPlayer")}
              </AppButton>
            </Animated.View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
