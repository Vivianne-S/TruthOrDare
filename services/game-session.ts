/**
 * In-memory game session state.
 * Holds players, current turn index, selected category, and questions.
 * Used by add-players (setGamePlayers), categories (setGameCategory), and game screen (useGameSession).
 */
import { Player } from "@/types/player";
import type { Question } from "@/types/category";

let gamePlayers: Player[] = [];
let currentPlayerIndex = 0;

let selectedCategoryId: string | null = null;
let selectedCategoryName: string | null = null;
let gameQuestions: Question[] = [];

export const setGamePlayers = (players: Player[]) => {
  gamePlayers = players;
  currentPlayerIndex = 0;
};

export const getGamePlayers = (): Player[] => gamePlayers;

export const getCurrentPlayer = (): Player | null =>
  gamePlayers.length > 0 ? gamePlayers[currentPlayerIndex] : null;

export const moveToNextPlayer = (): Player | null => {
  if (gamePlayers.length === 0) return null;
  currentPlayerIndex = (currentPlayerIndex + 1) % gamePlayers.length;
  return getCurrentPlayer();
};

export const setGameCategory = (
  categoryId: string,
  categoryName: string,
  questions: Question[]
) => {
  selectedCategoryId = categoryId;
  selectedCategoryName = categoryName;
  gameQuestions = questions;
};

export const getSelectedCategoryId = (): string | null => selectedCategoryId;

export const getSelectedCategoryName = (): string | null =>
  selectedCategoryName;

export const getGameQuestions = (): Question[] => gameQuestions;

// Returns a random question of type "truth" or "dare" from the current category
export const getRandomQuestionByType = (type: string): Question | null => {
  const normalized = type.toLowerCase().trim();
  const pool = gameQuestions.filter(
    (q) => q.type.toLowerCase().trim() === normalized
  );
  if (pool.length === 0) return null;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? null;
};


