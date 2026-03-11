/**
 * In-memory game session state.
 * Holds players, current turn index, selected category, and questions.
 * Uses shuffled truth/dare pools per session; game ends when player picks from an empty pool.
 */
import { Player } from "@/types/player";
import type { PlayerStats } from "@/types/game";
import type { Question } from "@/types/category";
import { shuffleArray } from "@/utils/shuffle";

let gamePlayers: Player[] = [];
let currentPlayerIndex = 0;

let selectedCategoryId: string | null = null;
let selectedCategoryName: string | null = null;
let gameQuestions: Question[] = [];

let truthPool: Question[] = [];
let darePool: Question[] = [];
let playerStats: Record<string, PlayerStats> = {};

export type { PlayerStats };

export const setGamePlayers = (players: Player[]) => {
  gamePlayers = players;
  currentPlayerIndex = 0;
  playerStats = {};
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
  playerStats = {};

  const truths = questions.filter(
    (q) => q.type.toLowerCase().trim() === "truth"
  );
  const dares = questions.filter(
    (q) => q.type.toLowerCase().trim() === "dare"
  );
  truthPool = shuffleArray(truths);
  darePool = shuffleArray(dares);
};

export const getSelectedCategoryId = (): string | null => selectedCategoryId;

export const getSelectedCategoryName = (): string | null =>
  selectedCategoryName;

export const getGameQuestions = (): Question[] => gameQuestions;

export const drawNextQuestionByType = (type: string): Question | null => {
  const normalized = type.toLowerCase().trim();
  if (normalized === "truth") {
    return truthPool.length > 0 ? truthPool.shift() ?? null : null;
  }
  if (normalized === "dare") {
    return darePool.length > 0 ? darePool.shift() ?? null : null;
  }
  return null;
};

export const isGameOver = (): boolean =>
  truthPool.length === 0 && darePool.length === 0;

export const getRemainingCount = (): { truths: number; dares: number } => ({
  truths: truthPool.length,
  dares: darePool.length,
});

export const recordQuestionForPlayer = (
  playerId: string,
  type: "truth" | "dare"
) => {
  const stats = playerStats[playerId] ?? { truthCount: 0, dareCount: 0 };
  if (type === "truth") {
    stats.truthCount += 1;
  } else {
    stats.dareCount += 1;
  }
  playerStats[playerId] = stats;
};

export const getPlayerStats = (): Record<string, PlayerStats> =>
  Object.fromEntries(
    gamePlayers.map((p) => [
      p.id,
      playerStats[p.id] ?? { truthCount: 0, dareCount: 0 },
    ])
  );

export const restartGame = (): void => {
  currentPlayerIndex = 0;
  playerStats = {};

  const truths = gameQuestions.filter(
    (q) => q.type.toLowerCase().trim() === "truth"
  );
  const dares = gameQuestions.filter(
    (q) => q.type.toLowerCase().trim() === "dare"
  );
  truthPool = shuffleArray(truths);
  darePool = shuffleArray(dares);
};
