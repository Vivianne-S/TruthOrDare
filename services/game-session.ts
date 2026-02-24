import { Player } from "@/types/player";

let gamePlayers: Player[] = [];
let currentPlayerIndex = 0;

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

