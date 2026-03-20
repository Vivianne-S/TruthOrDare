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
  /** Show Oops modal / block Next: one pool empty (unless user continued) or both empty */
  const [endAfterThisTurn, setEndAfterThisTurn] = useState(false);
  /** After "Continue" while only one pool was 0 — keep playing without modal until 0/0 */
  const [suppressPartialPoolModal, setSuppressPartialPoolModal] = useState(false);
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
    const updated = moveToNextPlayer();
    setCurrentPlayer(updated);
    setCurrentQuestion(null);
    setHasChosenThisTurn(false);
    syncPoolCounts();
  };

  const forceEndGame = useCallback(() => {
    setCurrentQuestion(null);
    setHasChosenThisTurn(false);
    setIsGameOver(true);
    setAwards(computeAwards(getGamePlayers(), getPlayerStats()));
  }, []);

  /** After one pool ran out: skip further Oops until both pools are 0; advance turn. */
  const continueWithRemainingPool = () => {
    setSuppressPartialPoolModal(true);
    setEndAfterThisTurn(false);
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
    const bothEmpty = remaining.truths === 0 && remaining.dares === 0;
    const oneSideEmpty = remaining.truths === 0 || remaining.dares === 0;
    setEndAfterThisTurn(
      bothEmpty || (oneSideEmpty && !suppressPartialPoolModal),
    );
  };

  const hasPlayers = players.length > 0;

  const restartGameSession = useCallback(() => {
    restartGame();
    setPlayers(getGamePlayers());
    setIsGameOver(false);
    setEndAfterThisTurn(false);
    setSuppressPartialPoolModal(false);
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
      setSuppressPartialPoolModal(false);
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
    setSuppressPartialPoolModal(false);
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
    continueWithRemainingPool,
    forceEndGame,
  };
}
