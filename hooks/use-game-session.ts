/**
 * Game session hook: reads from game-session service and exposes
 * currentPlayer, currentQuestion, categoryName, nextPlayer, showTruth, showDare.
 * Tracks game over and computes awards for the Game Over screen.
 */
import { useEffect, useState } from "react";

import {
  drawNextQuestionByType,
  getCurrentPlayer,
  getGamePlayers,
  getGameQuestions,
  getRemainingCount,
  getPlayerStats,
  getSelectedCategoryName,
  moveToNextPlayer,
  recordQuestionForPlayer,
  restartGame,
} from "@/services/game-session";
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
  const [hasChosenThisTurn, setHasChosenThisTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [endAfterThisTurn, setEndAfterThisTurn] = useState(false);
  const [awards, setAwards] = useState<GameAwards>({
    mostDaring: null,
    truthfulAngel: null,
    superstar: null,
  });

  useEffect(() => {
    setPlayers(getGamePlayers());
    setCurrentPlayer(getCurrentPlayer());
    setCategoryName(getSelectedCategoryName());
    getGameQuestions();
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
  };

  const showQuestion = (type: "truth" | "dare") => {
    if (hasChosenThisTurn) return;
    const question = drawNextQuestionByType(type);
    if (question === null) {
      setIsGameOver(true);
      setAwards(computeAwards(getGamePlayers(), getPlayerStats()));
      return;
    }
    if (currentPlayer) {
      recordQuestionForPlayer(currentPlayer.id, type);
    }
    setCurrentQuestion(question);
    setHasChosenThisTurn(true);

    const remaining = getRemainingCount();
    if (remaining.truths === 0 || remaining.dares === 0) {
      setEndAfterThisTurn(true);
    }
  };

  const hasPlayers = players.length > 0;

  const restartGameSession = () => {
    restartGame();
    setIsGameOver(false);
    setEndAfterThisTurn(false);
    setAwards({ mostDaring: null, truthfulAngel: null, superstar: null });
    setCurrentPlayer(getCurrentPlayer());
    setCurrentQuestion(null);
    setHasChosenThisTurn(false);
  };

  return {
    players,
    currentPlayer,
    hasPlayers,
    nextPlayer,
    currentQuestion,
    categoryName,
    isGameOver,
    endAfterThisTurn,
    awards,
    restartGameSession,
    showTruth: () => showQuestion("truth"),
    showDare: () => showQuestion("dare"),
    isMyTurn: true,
    loading: false,
  };
}
