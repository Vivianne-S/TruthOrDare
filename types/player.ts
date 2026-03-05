export const UNSELECTED_AVATAR = -1;
export const MIN_PLAYERS = 2;

// Player model used in add-players and game-session; avatarId indexes into AVATARS
export type Player = {
  id: string;
  name: string;
  avatarId: number;
};
