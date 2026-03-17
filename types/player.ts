export const UNSELECTED_AVATAR = -1;
export const MIN_PLAYERS = 2;

// Player model used in add-players and game-session; avatarId indexes into AVATARS
// userId is set for multiplayer (game_room_players.user_id) for "is my turn" check
export type Player = {
  id: string;
  name: string;
  avatarId: number;
  userId?: string;
};
