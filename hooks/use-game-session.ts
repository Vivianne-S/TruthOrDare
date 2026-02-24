import { useEffect, useState } from "react";

import { getCurrentPlayer, getGamePlayers, moveToNextPlayer } from "@/services/game-session";
import { Player } from "@/types/player";

export function useGameSession() {
  const [players, setPlayers] = useState<Player[]>(() => getGamePlayers());
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => getCurrentPlayer());

  useEffect(() => {
    setPlayers(getGamePlayers());
    setCurrentPlayer(getCurrentPlayer());
  }, []);

  const nextPlayer = () => {
    const updated = moveToNextPlayer();
    setCurrentPlayer(updated);
  };

  const hasPlayers = players.length > 0;

  return {
    players,
    currentPlayer,
    hasPlayers,
    nextPlayer,
  };
}

