import { useEffect, useState } from "react";

import {
  getCurrentPlayer,
  getGamePlayers,
  getGameQuestions,
  getRandomQuestionByType,
  getSelectedCategoryName,
  moveToNextPlayer,
} from "@/services/game-session";
import type { Question } from "@/types/category";
import type { Player } from "@/types/player";

export function useGameSession() {
  const [players, setPlayers] = useState<Player[]>(() => getGamePlayers());
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() =>
    getCurrentPlayer()
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(() =>
    getSelectedCategoryName()
  );
  const [hasChosenThisTurn, setHasChosenThisTurn] = useState(false);

  useEffect(() => {
    setPlayers(getGamePlayers());
    setCurrentPlayer(getCurrentPlayer());
    setCategoryName(getSelectedCategoryName());
    // Ensure questions are initialised, even if we don't use the value directly.
    getGameQuestions();
  }, []);

  const nextPlayer = () => {
    const updated = moveToNextPlayer();
    setCurrentPlayer(updated);
    setCurrentQuestion(null);
    setHasChosenThisTurn(false);
  };

  const showQuestion = (type: "truth" | "dare") => {
    if (hasChosenThisTurn) return;
    const question = getRandomQuestionByType(type);
    setCurrentQuestion(question);
    setHasChosenThisTurn(true);
  };

  const hasPlayers = players.length > 0;

  return {
    players,
    currentPlayer,
    hasPlayers,
    nextPlayer,
    currentQuestion,
    categoryName,
    hasChosenThisTurn,
    showTruth: () => showQuestion("truth"),
    showDare: () => showQuestion("dare"),
  };
}


