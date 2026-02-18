/**
 * Tillgängliga avatarer att välja mellan för spelare.
 * Bilder från assets/images/avatars/
 */
export const AVATARS = [
  require('@/assets/images/avatars/avatar.png'),
  require('@/assets/images/avatars/avatar2png.png'),
  require('@/assets/images/avatars/avatar3.png'),
  require('@/assets/images/avatars/avatar4.png'),
  require('@/assets/images/avatars/avatar5.png'),
  require('@/assets/images/avatars/avatar6.png'),
  require('@/assets/images/avatars/avatar7.png'),
  require('@/assets/images/avatars/avatar8.png'),
  require('@/assets/images/avatars/avatar9.png'),
  require('@/assets/images/avatars/avatar10.png'),
] as const;

export type AvatarId = number;
