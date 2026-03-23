/**
 * Game session hook: reads from game-session service and exposes
 * currentPlayer, currentQuestion, categoryName, nextPlayer, showTruth, showDare.
 * Tracks game over and computes awards for the Game Over screen.
 */
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { hasPremiumQuestionsAccess } from "@/services/premium-questions-access";
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
  /** After "Continue" while only one pool was 0 — keep playing without modal until 0/0 */
  const [suppressPartialPoolModal, setSuppressPartialPoolModal] = useState(false);
  const [awards, setAwards] = useState<GameAwards>({
    mostDaring: null,
    truthfulAngel: null,
    superstar: null,
  });
  const [truthsLeft, setTruthsLeft] = useState(() => getRemainingCount().truths);
  const [daresLeft, setDaresLeft] = useState(() => getRemainingCount().dares);

  /** Derived so pool UI + shop flow can’t desync from “needs Oops / end” (fixes local 0/0 stuck). */
  const endAfterThisTurn = useMemo(() => {
    if (isGameOver) return false;
    const t = truthsLeft;
    const d = daresLeft;
    const bothEmpty = t === 0 && d === 0;
    const oneEmpty = t === 0 || d === 0;
    if (!oneEmpty) return false;
    if (bothEmpty) return true;
    if (currentQuestion) {
      return !suppressPartialPoolModal;
    }
    return false;
  }, [
    isGameOver,
    truthsLeft,
    daresLeft,
    currentQuestion,
    suppressPartialPoolModal,
  ]);

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

  /**
   * Host chose Continue on Oops: remember partial deck, hide warning for this stretch.
   * Same question and turn stay until the user presses Next player.
   */
  const continueWithRemainingPool = () => {
    setSuppressPartialPoolModal(true);
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
  };

  const hasPlayers = players.length > 0;

  const restartGameSession = useCallback(() => {
    restartGame();
    setPlayers(getGamePlayers());
    setIsGameOver(false);
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
      setSuppressPartialPoolModal(false);
      setAwards({ mostDaring: null, truthfulAngel: null, superstar: null });
      syncPoolCounts();
    }, []),
  );

  const refreshAfterPremiumPurchase = async (categoryId: string) => {
    const hasPremium = await hasPremiumQuestionsAccess(categoryId);
    if (!hasPremium) return;
    const allQuestions = await getQuestionsByCategory(categoryId, {
      includePremium: true,
    });
    addQuestionsToPools(allQuestions);
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
