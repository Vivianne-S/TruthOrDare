/**
 * Game screen: orchestrates game session, GameView, GameOverScreen, and exit modals.
 * Uses useMultiplayerGame when roomId is present (synced via Supabase).
 */
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { GameView } from "@/components/game/GameView";
import { ExitConfirmModal } from "@/components/ui/ExitConfirmModal";
import { ExitMenuModal } from "@/components/ui/ExitMenuModal";
import { GameOverScreen } from "@/components/ui/GameOverScreen/index";
import { OutOfQuestionsModal } from "@/components/ui/OutOfQuestionsModal";
import { OutOfQuestionsHostOverlay } from "@/components/ui/OutOfQuestionsHostOverlay";
import { useGameSession } from "@/hooks/use-game-session";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";

export default function GameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const isMultiplayer = Boolean(roomId);

  const localSession = useGameSession();
  const multiplayerSession = useMultiplayerGame(roomId);

  const session = isMultiplayer ? multiplayerSession : localSession;
  const {
    players,
    currentPlayer,
    hasPlayers,
    nextPlayer,
    currentQuestion,
    categoryName,
    categoryId,
    isGameOver,
    awards,
    restartGameSession,
    showTruth,
    showDare,
    isMyTurn = true,
    loading: sessionLoading = false,
    refreshAfterPremiumPurchase,
  } = session as ReturnType<typeof useGameSession> | ReturnType<typeof useMultiplayerGame>;

  const { isHost: sessionIsHost } = (session as ReturnType<
    typeof useMultiplayerGame
  >) ?? { isHost: false };

  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showOutOfQuestions, setShowOutOfQuestions] = useState(false);
  const [showHostInMenu, setShowHostInMenu] = useState(false);

  const handleDoorPress = () => setShowExitMenu(true);
  const handleExitGame = () => {
    setShowExitMenu(false);
    setShowExitConfirm(true);
  };

  const canInteract = isMultiplayer ? (isMyTurn ?? false) : true;
  const endAfterThisTurn =
    "endAfterThisTurn" in session ? (session.endAfterThisTurn ?? false) : false;
  const isHost = isMultiplayer ? sessionIsHost ?? false : true;

  useEffect(() => {
    if (!isMultiplayer) {
      setShowHostInMenu(false);
      return;
    }
    if (endAfterThisTurn) {
      if (isHost) {
        setShowOutOfQuestions(true);
        setShowHostInMenu(false);
      } else {
        setShowHostInMenu(true);
        setShowOutOfQuestions(false);
      }
    } else {
      setShowHostInMenu(false);
    }
  }, [isMultiplayer, endAfterThisTurn, isHost]);

  useFocusEffect(
    useCallback(() => {
      if (
        !isMultiplayer &&
        categoryId &&
        endAfterThisTurn &&
        refreshAfterPremiumPurchase
      ) {
        refreshAfterPremiumPurchase(categoryId);
      }
    }, [
      isMultiplayer,
      categoryId,
      endAfterThisTurn,
      refreshAfterPremiumPurchase,
    ])
  );

  const handleNextPlayer = () => {
    if (endAfterThisTurn) {
      return;
    }
    nextPlayer();
  };

  if (isMultiplayer && sessionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  if (isGameOver) {
    return (
      <>
        <GameOverScreen
          players={players}
          awards={awards}
          onPlayAgain={restartGameSession}
          onExitPress={() => setShowExitConfirm(true)}
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

  return (
    <>
      <GameView
        currentPlayer={currentPlayer}
        categoryName={categoryName}
        currentQuestion={currentQuestion}
        hasPlayers={hasPlayers}
        isSpeechEnabled={isSpeechEnabled}
        onToggleSpeech={() => setIsSpeechEnabled((prev) => !prev)}
        onDoorPress={handleDoorPress}
        onShowTruth={showTruth}
        onShowDare={showDare}
        onNextPlayer={handleNextPlayer}
        canInteract={canInteract}
      />
      {isMultiplayer && (
        <OutOfQuestionsHostOverlay
          visible={showHostInMenu}
        />
      )}
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
      <OutOfQuestionsModal
        visible={showOutOfQuestions}
        onBuyMore={() => {
          setShowOutOfQuestions(false);
          router.push({
            pathname: "/shop",
            params: {
              categoryId: categoryId ?? "",
              fromOutOfQuestions: "true",
              ...(roomId && { roomId }),
            },
          });
        }}
        onFinish={() => {
          setShowOutOfQuestions(false);
          nextPlayer();
        }}
      />
    </>
  );
}
