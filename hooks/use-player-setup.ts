/**
 * Player setup hook: manages players list, avatar picker state, and validation.
 * Used by add-players screen. Persists to game-session when navigating (categories or game).
 */
import { useCallback, useMemo, useState } from "react";

import {
  canStartGame,
  createEmptyPlayer,
  createInitialPlayers,
  removePlayerById,
  updatePlayerAvatarById,
  updatePlayerNameById,
} from "@/services/player-service";
import { Player, UNSELECTED_AVATAR } from "@/types/player";

export function usePlayerSetup(initialPlayers?: Player[] | null) {
  const [players, setPlayers] = useState<Player[]>(() =>
    initialPlayers && initialPlayers.length > 0
      ? initialPlayers
      : createInitialPlayers()
  );
  const [avatarPickerPlayerId, setAvatarPickerPlayerId] = useState<string | null>(
    null
  );

  const addPlayer = useCallback(() => {
    setPlayers((prev) => [...prev, createEmptyPlayer()]);
  }, []);

  const updatePlayerName = useCallback((playerId: string, name: string) => {
    setPlayers((prev) => updatePlayerNameById(prev, playerId, name));
  }, []);

  const updatePlayerAvatar = useCallback((playerId: string, avatarId: number) => {
    setPlayers((prev) => updatePlayerAvatarById(prev, playerId, avatarId));
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setPlayers((prev) => removePlayerById(prev, playerId));
    setAvatarPickerPlayerId((prev) => (prev === playerId ? null : prev));
  }, []);

  const openAvatarPicker = useCallback((playerId: string) => {
    setAvatarPickerPlayerId(playerId);
  }, []);

  const closeAvatarPicker = useCallback(() => {
    setAvatarPickerPlayerId(null);
  }, []);

  const selectedAvatarId = useMemo(() => {
    if (!avatarPickerPlayerId) return UNSELECTED_AVATAR;
    return (
      players.find((player) => player.id === avatarPickerPlayerId)?.avatarId ??
      UNSELECTED_AVATAR
    );
  }, [avatarPickerPlayerId, players]);

  const selectAvatarForActivePlayer = useCallback(
    (avatarId: number) => {
      if (!avatarPickerPlayerId) return;
      updatePlayerAvatar(avatarPickerPlayerId, avatarId);
      closeAvatarPicker();
    },
    [avatarPickerPlayerId, closeAvatarPicker, updatePlayerAvatar]
  );

  const canStart = useMemo(() => canStartGame(players), [players]);

  return {
    players,
    addPlayer,
    updatePlayerName,
    removePlayer,
    avatarPickerPlayerId,
    selectedAvatarId,
    openAvatarPicker,
    closeAvatarPicker,
    selectAvatarForActivePlayer,
    canStart,
  };
}
