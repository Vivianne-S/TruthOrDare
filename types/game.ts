import type { Player } from "./player";

export type PlayerStats = {
  truthCount: number;
  dareCount: number;
};

/**
 * Awards for Game Over screen.
 * mostDaring → Dare Devil, truthfulAngel → Truthful Angel, superstar → Best of Both Worlds.
 */
export type GameAwards = {
  mostDaring: Player | null;
  truthfulAngel: Player | null;
  superstar: Player | null;
};
