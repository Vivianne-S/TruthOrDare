/**
 * Game screen: orchestrates game session, GameView, GameOverScreen, and exit modals.
 * Uses useMultiplayerGame when roomId is present (synced via Supabase).
 */
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { GameView } from "@/components/game/GameView";
import { ExitConfirmModal } from "@/components/ui/ExitConfirmModal";
import { ExitMenuModal } from "@/components/ui/ExitMenuModal";
import { GameOverScreen } from "@/components/ui/GameOverScreen/index";
import { OutOfQuestionsModal } from "@/components/ui/OutOfQuestionsModal";
import { OutOfQuestionsHostOverlay } from "@/components/ui/OutOfQuestionsHostOverlay";
import { useGameSession } from "@/hooks/use-game-session";
import { useMultiplayerGame } from "@/hooks/use-multiplayer-game";
import { isFreeStarterCategoryName } from "@/constants/category-bubbles";
import { reloadApp } from "@/lib/reload-app";
import { getCategoryById } from "@/services/categories";
import { hasPremiumQuestionsAccess } from "@/services/premium-questions-access";
import {
  endGameInRoom,
  setRoomAcknowledgedPartialDeck,
  setRoomDeckOopsPending,
} from "@/services/game-room";

export default function GameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const isMultiplayer = Boolean(roomId);

  const localSession = useGameSession();
  const multiplayerSession = useMultiplayerGame(roomId);
  const { continueWithRemainingPool, forceEndGame } = localSession;
  const { notifyHostAway } = multiplayerSession;

  const session = isMultiplayer ? multiplayerSession : localSession;
  // One screen supports two session providers; this union keeps shared UI wiring in one place.
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

  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showOutOfQuestions, setShowOutOfQuestions] = useState(false);
  /** `true` = full premium category (IAP); Oops hides shop — only continue / exit. */
  const [lockedPremiumCategory, setLockedPremiumCategory] = useState<
    boolean | null
  >(null);
  /** Free category: user already owns premium-questions pack / Pro — hide shop in Oops. */
  const [ownsPremiumQuestions, setOwnsPremiumQuestions] = useState<
    boolean | null
  >(null);

  const refreshCategoryPurchaseMeta = useCallback(async () => {
    if (!categoryId) {
      setLockedPremiumCategory(null);
      setOwnsPremiumQuestions(null);
      return;
    }
    try {
      const [cat, ownsPremium] = await Promise.all([
        getCategoryById(categoryId),
        hasPremiumQuestionsAccess(categoryId),
      ]);
      setLockedPremiumCategory(cat?.is_premium === true);
      setOwnsPremiumQuestions(ownsPremium);
    } catch {
      setLockedPremiumCategory(false);
      setOwnsPremiumQuestions(false);
    }
  }, [categoryId]);

  useFocusEffect(
    useCallback(() => {
      void refreshCategoryPurchaseMeta();
    }, [refreshCategoryPurchaseMeta])
  );

  const handleDoorPress = () => setShowExitMenu(true);
  const handleExitGame = () => {
    setShowExitMenu(false);
    setShowExitConfirm(true);
  };

  const canInteract = isMultiplayer ? (isMyTurn ?? false) : true;
  const endAfterThisTurn =
    "endAfterThisTurn" in session ? (session.endAfterThisTurn ?? false) : false;
  const isHost = isMultiplayer ? multiplayerSession.isHost : true;
  const deckOopsPending = isMultiplayer && (multiplayerSession.deckOopsPending ?? false);

  /**
   * Multiplayer host: end room for everyone + full JS reload (same as guests after sync).
   * Local: navigate home without reloading the bundle.
   */
  const handleConfirmExitToHome = useCallback(async () => {
    setShowExitConfirm(false);
    if (isMultiplayer && roomId && isHost) {
      try {
        await endGameInRoom(roomId, { hostExitRestart: true });
      } catch {
        /* Room may already be game_over; still reload */
      }
      await reloadApp();
      return;
    }
    router.replace("/");
  }, [isMultiplayer, roomId, isHost]);

  const showExitMenuRef = useRef(showExitMenu);
  showExitMenuRef.current = showExitMenu;

  useEffect(() => {
    if (!isMultiplayer || !roomId) return;
    void notifyHostAway(showExitMenu);
  }, [isMultiplayer, roomId, showExitMenu, notifyHostAway]);

  useFocusEffect(
    useCallback(() => {
      if (!isMultiplayer || !roomId) return;
      void notifyHostAway(showExitMenuRef.current);
      return () => {
        void notifyHostAway(true);
      };
    }, [isMultiplayer, roomId, notifyHostAway])
  );

  // Close Oops if the low-deck condition clears (e.g. sync). Modal opens only from Next player, not over the question.
  useEffect(() => {
    if (!endAfterThisTurn) {
      setShowOutOfQuestions(false);
    }
  }, [endAfterThisTurn]);

  // Guest pressed Next on a low deck: host opens Oops. For 0/0 on free starter
  // categories without premium, host also opens final Oops (buy or end round).
  useEffect(() => {
    if (!isMultiplayer || !isHost || !deckOopsPending || !endAfterThisTurn) {
      return;
    }
    if (ownsPremiumQuestions === true) {
      return;
    }
    const bothEmpty = truthsLeft === 0 && daresLeft === 0;
    const eligibleFinalOops =
      bothEmpty &&
      isFreeStarterCategoryName(categoryName) &&
      lockedPremiumCategory !== true;
    if (bothEmpty && !eligibleFinalOops) {
      return;
    }
    setShowOutOfQuestions(true);
  }, [
    isMultiplayer,
    isHost,
    deckOopsPending,
    endAfterThisTurn,
    truthsLeft,
    daresLeft,
    ownsPremiumQuestions,
    categoryName,
    lockedPremiumCategory,
  ]);

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

  const handleNextPlayer = async () => {
    if (endAfterThisTurn) {
      const bothPoolsEmpty = truthsLeft === 0 && daresLeft === 0;
      /** Love / Chaos / Funny: last Oops when free pools are 0/0 and host has not bought premium questions. */
      const eligibleFinalFreePoolsOops =
        bothPoolsEmpty &&
        isFreeStarterCategoryName(categoryName) &&
        lockedPremiumCategory !== true &&
        ownsPremiumQuestions !== true;

      if (isMultiplayer && roomId && bothPoolsEmpty && eligibleFinalFreePoolsOops && !isHost) {
        try {
          await setRoomDeckOopsPending(roomId, true);
        } catch {
          /* Realtime will still reflect room state */
        }
        return;
      }

      if (
        bothPoolsEmpty &&
        eligibleFinalFreePoolsOops &&
        (!isMultiplayer || isHost)
      ) {
        setShowOutOfQuestions(true);
        return;
      }

      if (isMultiplayer && roomId && bothPoolsEmpty) {
        try {
          await endGameInRoom(roomId);
        } catch {
          // Realtime will still reflect room state; avoid blocking the player silently.
        }
        return;
      }
      if (!isMultiplayer && bothPoolsEmpty) {
        forceEndGame();
        return;
      }
      /** Host/local only: already own premium questions — no Oops; play until 0/0 then game over. */
      const skipPartialDeckOops =
        ownsPremiumQuestions === true && (!isMultiplayer || isHost);
      if (skipPartialDeckOops) {
        if (isMultiplayer && roomId) {
          try {
            await setRoomAcknowledgedPartialDeck(roomId, true);
            await setRoomDeckOopsPending(roomId, false);
          } catch {
            /* Realtime will still reflect room state */
          }
        } else {
          continueWithRemainingPool();
        }
        return;
      }
      if (isMultiplayer && roomId && !isHost) {
        try {
          await setRoomDeckOopsPending(roomId, true);
        } catch {
          // Realtime will still reflect room state; avoid blocking the player silently.
        }
        return;
      }
      if (!isMultiplayer || isHost) {
        setShowOutOfQuestions(true);
      }
      return;
    }
    nextPlayer();
  };

  const canContinueWithRemainingPool = truthsLeft > 0 || daresLeft > 0;

  const handleContinueOutOfQuestions = useCallback(async () => {
    setShowOutOfQuestions(false);
    if (isMultiplayer && roomId) {
      try {
        await setRoomAcknowledgedPartialDeck(roomId, true);
        await setRoomDeckOopsPending(roomId, false);
      } catch {
        // Room sync may have failed; modal already closed.
      }
      return;
    }
    continueWithRemainingPool();
  }, [isMultiplayer, roomId, continueWithRemainingPool]);

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
          showPlayAgain={!isMultiplayer}
          showNewGame={!isMultiplayer}
          showExit={!isMultiplayer || isHost}
        />
        <ExitConfirmModal
          visible={showExitConfirm}
          onNo={() => setShowExitConfirm(false)}
          onYes={() => {
            void handleConfirmExitToHome();
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
        onDoorPress={
          isMultiplayer && !isHost ? undefined : handleDoorPress
        }
        onShowTruth={showTruth}
        onShowDare={showDare}
        onNextPlayer={handleNextPlayer}
        canInteract={canInteract}
        showFreePoolLabels={
          lockedPremiumCategory === false && ownsPremiumQuestions !== true
        }
      />
      {multiplayerSession.guestHostOverlayVisible ? (
        <OutOfQuestionsHostOverlay
          visible
          variant={deckOopsPending ? "waitingForHostDeck" : "hostInMenu"}
        />
      ) : null}
      <ExitMenuModal
        visible={showExitMenu}
        onDismiss={() => setShowExitMenu(false)}
        showBackToCategories={!isMultiplayer}
        showAddMorePlayers={!isMultiplayer}
        onBackToCategories={() => {
          setShowExitMenu(false);
          if (isMultiplayer && roomId) {
            void notifyHostAway(true);
          }
          router.replace("/categories");
        }}
        onAddMorePlayers={() => {
          setShowExitMenu(false);
          if (isMultiplayer && roomId) {
            void notifyHostAway(true);
          }
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
          void handleConfirmExitToHome();
        }}
      />
      <OutOfQuestionsModal
        visible={isMultiplayer ? (isHost ? showOutOfQuestions : false) : showOutOfQuestions}
        canContinue={canContinueWithRemainingPool}
        showShopButton={
          lockedPremiumCategory !== true && ownsPremiumQuestions !== true
        }
        onContinue={handleContinueOutOfQuestions}
        onBuyMore={async () => {
          setShowOutOfQuestions(false);
          if (isMultiplayer && roomId) {
            try {
              await setRoomDeckOopsPending(roomId, false);
              await notifyHostAway(true);
            } catch {
              /* ignore */
            }
          }
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
            forceEndGame();
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
