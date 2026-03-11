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
              onPress={onToggleSpeech}
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
              onPress={onShowTruth}
              disabled={!hasPlayers || !!currentQuestion}
            >
              TRUTH
            </AppButton>
            <AppButton
              variant="dare"
              onPress={onShowDare}
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
                onPress={onNextPlayer}
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
