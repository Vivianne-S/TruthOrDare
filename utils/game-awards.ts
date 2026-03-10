import type { Player } from "@/types/player";
import type { GameAwards, PlayerStats } from "@/types/game";

/**
 * Computes Game Over awards: Dare Devil (most dares), Truthful Angel (most truths),
 * Challenge Master (most total; prefers player who did both types over one who did only one).
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
    const total = s.truthCount + s.dareCount;
    const didBoth = s.truthCount > 0 && s.dareCount > 0;
    const currentDidBoth =
      superstar &&
      (stats[superstar.id]?.truthCount ?? 0) > 0 &&
      (stats[superstar.id]?.dareCount ?? 0) > 0;

    // Challenge Master: prefer player who did both types; if same, higher total wins
    const pWins =
      (didBoth && !currentDidBoth) ||
      (didBoth === !!currentDidBoth && total > maxTotal);

    if (pWins) {
      maxTotal = total;
      superstar = p;
    }
  }

  return { mostDaring, truthfulAngel, superstar };
}
