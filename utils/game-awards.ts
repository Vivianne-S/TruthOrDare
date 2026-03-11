import type { Player } from "@/types/player";
import type { GameAwards, PlayerStats } from "@/types/game";

/**
 * Computes Game Over awards: Dare Devil (most dares), Truthful Angel (most truths),
 * Best of Both Worlds (only players who did both truths AND dares; highest total among those).
 */
export function computeAwards(
  players: Player[],
  stats: Record<string, PlayerStats>
): GameAwards {
  if (players.length === 0) {
    return { mostDaring: null, truthfulAngel: null, superstar: null };
  }

  let mostDaring: Player | null = null;
  let maxDares = -1;

  let truthfulAngel: Player | null = null;
  let maxTruths = -1;

  let superstar: Player | null = null;
  let maxTotal = -1;

  for (const p of players) {
    const s = stats[p.id] ?? { truthCount: 0, dareCount: 0 };
    if (s.dareCount > maxDares) {
      maxDares = s.dareCount;
      mostDaring = p;
    }
    if (s.truthCount > maxTruths) {
      maxTruths = s.truthCount;
      truthfulAngel = p;
    }
    // Best of Both Worlds: only players who did BOTH truths and dares; highest total among those
    const didBoth = s.truthCount > 0 && s.dareCount > 0;
    if (didBoth) {
      const total = s.truthCount + s.dareCount;
      if (total > maxTotal) {
        maxTotal = total;
        superstar = p;
      }
    }
  }

  return { mostDaring, truthfulAngel, superstar };
}
