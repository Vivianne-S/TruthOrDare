import { MIN_PLAYERS, Player, UNSELECTED_AVATAR } from "@/types/player";

let playerIdCounter = 0;

const createPlayerId = () => {
  playerIdCounter += 1;
  return `player-${Date.now()}-${playerIdCounter}`;
};

export const createEmptyPlayer = (): Player => ({
  id: createPlayerId(),
  name: "",
  avatarId: UNSELECTED_AVATAR,
});

export const createInitialPlayers = (count = MIN_PLAYERS): Player[] =>
  Array.from({ length: count }, createEmptyPlayer);

export const updatePlayerNameById = (
  players: Player[],
  playerId: string,
  name: string
): Player[] =>
  players.map((player) =>
    player.id === playerId ? { ...player, name } : player
  );

export const updatePlayerAvatarById = (
  players: Player[],
  playerId: string,
  avatarId: number
): Player[] =>
  players.map((player) =>
    player.id === playerId ? { ...player, avatarId } : player
  );

export const removePlayerById = (players: Player[], playerId: string): Player[] =>
  players.filter((player) => player.id !== playerId);

export const isPlayerValid = (player: Player): boolean =>
  player.name.trim().length > 0 && player.avatarId >= 0;

export const canStartGame = (
  players: Player[],
  minPlayers = MIN_PLAYERS
): boolean => players.length >= minPlayers && players.every(isPlayerValid);
