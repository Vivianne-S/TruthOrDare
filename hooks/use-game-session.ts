/**
 * Game session hook: reads from game-session service and exposes
 * currentPlayer, currentQuestion, categoryName, nextPlayer, showTruth, showDare.
 * Tracks game over and computes awards for the Game Over screen.
 */
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addQuestionsToPools,
  consumePendingLocalSessionResyncAfterPlayerEdit,
  drawNextQuestionByType,
  getCurrentPlayer,
  getGamePlayers,
  getGameQuestions,
  getRemainingCount,
  getPlayerStats,
  getSelectedCategoryId,
  getSelectedCategoryName,
  moveToNextPlayer,
  recordQuestionForPlayer,
  restartGame,
} from "@/services/game-session";
import { getQuestionsByCategory } from "@/services/categories";
import type { Question } from "@/types/category";
import type { GameAwards } from "@/types/game";
import type { Player } from "@/types/player";
import { computeAwards } from "@/utils/game-awards";

export type { GameAwards };

export function useGameSession() {
  const [players, setPlayers] = useState<Player[]>(() => getGamePlayers());
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() =>
    getCurrentPlayer(),
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(() =>
    getSelectedCategoryName(),
  );
  const categoryId = getSelectedCategoryId();
  const [hasChosenThisTurn, setHasChosenThisTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [endAfterThisTurn, setEndAfterThisTurn] = useState(false);
  const [awards, setAwards] = useState<GameAwards>({
    mostDaring: null,
    truthfulAngel: null,
    superstar: null,
  });
  const [truthsLeft, setTruthsLeft] = useState(() => getRemainingCount().truths);
  const [daresLeft, setDaresLeft] = useState(() => getRemainingCount().dares);

  const syncPoolCounts = () => {
    const { truths, dares } = getRemainingCount();
    setTruthsLeft(truths);
    setDaresLeft(dares);
  };

  useEffect(() => {
    setPlayers(getGamePlayers());
    setCurrentPlayer(getCurrentPlayer());
    setCategoryName(getSelectedCategoryName());
    getGameQuestions();
    syncPoolCounts();
  }, []);

  const nextPlayer = () => {
    if (endAfterThisTurn) {
      setIsGameOver(true);
      setAwards(computeAwards(getGamePlayers(), getPlayerStats()));
      return;
    }
    const updated = moveToNextPlayer();
    setCurrentPlayer(updated);
    setCurrentQuestion(null);
    setHasChosenThisTurn(false);
    syncPoolCounts();
  };

  const showQuestion = (type: "truth" | "dare") => {
    if (hasChosenThisTurn) return;
    const question = drawNextQuestionByType(type);
    if (question === null) {
      syncPoolCounts();
      return;
    }
    if (currentPlayer) {
      recordQuestionForPlayer(currentPlayer.id, type);
    }
    setCurrentQuestion(question);
    setHasChosenThisTurn(true);

    const remaining = getRemainingCount();
    setTruthsLeft(remaining.truths);
    setDaresLeft(remaining.dares);
    if (remaining.truths === 0 || remaining.dares === 0) {
      setEndAfterThisTurn(true);
    }
  };

  const hasPlayers = players.length > 0;

  const restartGameSession = useCallback(() => {
    restartGame();
    setPlayers(getGamePlayers());
    setIsGameOver(false);
    setEndAfterThisTurn(false);
    setAwards({ mostDaring: null, truthfulAngel: null, superstar: null });
    setCurrentPlayer(getCurrentPlayer());
    setCurrentQuestion(null);
    setHasChosenThisTurn(false);
    syncPoolCounts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!consumePendingLocalSessionResyncAfterPlayerEdit()) return;
      setPlayers(getGamePlayers());
      setCurrentPlayer(getCurrentPlayer());
      setCategoryName(getSelectedCategoryName());
      setCurrentQuestion(null);
      setHasChosenThisTurn(false);
      setIsGameOver(false);
      setEndAfterThisTurn(false);
      setAwards({ mostDaring: null, truthfulAngel: null, superstar: null });
      syncPoolCounts();
    }, []),
  );

  const refreshAfterPremiumPurchase = async (categoryId: string) => {
    const [proValue, pqValue] = await Promise.all([
      AsyncStorage.getItem("demo_pro_purchased"),
      AsyncStorage.getItem("demo_unlocked_premium_questions"),
    ]);
    const isPro = proValue === "true";
    const unlockedIds: string[] = pqValue ? JSON.parse(pqValue) : [];
    const hasPremium =
      isPro || unlockedIds.includes(categoryId);
    if (!hasPremium) return;
    const allQuestions = await getQuestionsByCategory(categoryId, {
      includePremium: true,
    });
    addQuestionsToPools(allQuestions);
    setEndAfterThisTurn(false);
    syncPoolCounts();
  };

  return {
    players,
    currentPlayer,
    hasPlayers,
    nextPlayer,
    currentQuestion,
    categoryName,
    categoryId,
    isGameOver,
    endAfterThisTurn,
    awards,
    restartGameSession,
    showTruth: () => showQuestion("truth"),
    showDare: () => showQuestion("dare"),
    isMyTurn: true,
    loading: false,
    refreshAfterPremiumPurchase,
    truthsLeft,
    daresLeft,
  };
}
