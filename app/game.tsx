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
import { endGameInRoom } from "@/services/game-room";

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
    truthsLeft,
    daresLeft,
  } = session as ReturnType<typeof useGameSession> | ReturnType<typeof useMultiplayerGame>;

  const { isHost: sessionIsHost } = (session as ReturnType<
    typeof useMultiplayerGame
  >) ?? { isHost: false };

  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showOutOfQuestions, setShowOutOfQuestions] = useState(false);

  const handleDoorPress = () => setShowExitMenu(true);
  const handleExitGame = () => {
    setShowExitMenu(false);
    setShowExitConfirm(true);
  };

  const canInteract = isMultiplayer ? (isMyTurn ?? false) : true;
  const endAfterThisTurn =
    "endAfterThisTurn" in session ? (session.endAfterThisTurn ?? false) : false;
  const isHost = isMultiplayer ? sessionIsHost ?? false : true;
  const showHostInMenu =
    isMultiplayer && !isHost && !!currentQuestion && endAfterThisTurn;

  // Multiplayer: host should always be able to close the modal when navigating to Shop.
  useEffect(() => {
    if (!isMultiplayer || !isHost) return;
    if (!!currentQuestion && endAfterThisTurn) {
      setShowOutOfQuestions(true);
    } else if (!endAfterThisTurn) {
      setShowOutOfQuestions(false);
    }
  }, [isMultiplayer, isHost, currentQuestion, endAfterThisTurn]);

  useFocusEffect(
    useCallback(() => {
      if (
        categoryId &&
        endAfterThisTurn &&
        refreshAfterPremiumPurchase
      ) {
        refreshAfterPremiumPurchase(categoryId);
      }
    }, [
      categoryId,
      endAfterThisTurn,
      refreshAfterPremiumPurchase,
    ])
  );

  const handleNextPlayer = () => {
    if (endAfterThisTurn) {
      if (isHost) {
        setShowOutOfQuestions(true);
      }
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
          showRestartActions={!isMultiplayer || isHost}
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
        truthsLeft={truthsLeft}
        daresLeft={daresLeft}
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
          router.push(
            isMultiplayer
              ? "/add-players?addMore=true"
              : "/add-players?addMore=true&localGame=1",
          );
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
        visible={isMultiplayer ? (isHost ? showOutOfQuestions : false) : showOutOfQuestions}
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
          if (!isMultiplayer) {
            setShowOutOfQuestions(false);
            nextPlayer();
            return;
          }
          if (roomId) {
            endGameInRoom(roomId);
          }
        }}
      />
    </>
  );
}
