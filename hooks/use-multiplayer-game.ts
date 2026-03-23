/**
 * Multiplayer game hook: syncs game state from Supabase, exposes isMyTurn.
 * Only current player can choose Truth/Dare and press Next player.
 */
import { reloadApp } from "@/lib/reload-app";
import { supabase } from "@/lib/supabase";
import { getQuestionsByCategory } from "@/services/categories";
import { hasPremiumQuestionsAccess } from "@/services/premium-questions-access";
import {
  addQuestionsToRoomPools,
  chooseTruthOrDareInRoom,
  getRoomById,
  getRoomPlayers,
  nextPlayerInRoom,
  roomPlayersToPlayers,
  setRoomHostInExitMenu,
  type GameRoom,
  type GameRoomPlayer,
} from "@/services/game-room";
import type { Question } from "@/types/category";
import type { GameAwards } from "@/types/game";
import { computeAwards } from "@/utils/game-awards";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

export type { GameAwards };

function isTruthyHostAway(v: unknown): boolean {
  if (v === true || v === 1) return true;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}

export function useMultiplayerGame(roomId: string | undefined) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GameRoomPlayer[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  /** Fallback when DB column/realtime is missing or slow — host sends broadcast on same channel. */
  const [hostAwayBroadcast, setHostAwayBroadcast] = useState(false);
  const gameChannelRef = useRef<RealtimeChannel | null>(null);

  const playerList = roomPlayersToPlayers(players);
  const currentPlayer =
    players.length > 0 && room
      ? (playerList[room.current_player_index % players.length] ?? null)
      : null;
  const currentQuestion = (room?.current_question ?? null) as Question | null;
  const categoryName = room?.category_name ?? null;
  const categoryId = room?.category_id ?? null;
  const isGameOver = room?.status === "game_over";
  const isHost =
    !!room?.host_user_id &&
    !!myUserId &&
    String(room.host_user_id) === String(myUserId);
  /** Must not use `!isHost` before `myUserId` exists — that made real guests never qualify. */
  const isDefinitelyGuest =
    !!room?.host_user_id &&
    !!myUserId &&
    String(room.host_user_id) !== String(myUserId);
  const deckOopsPending = room?.deck_oops_pending === true;
  const hostInExitMenuDb = isTruthyHostAway(room?.host_in_exit_menu);
  const guestHostOverlayVisible =
    !!room &&
    isDefinitelyGuest &&
    (deckOopsPending || hostInExitMenuDb || hostAwayBroadcast);
  const truthPoolLength = Array.isArray(room?.truth_pool)
    ? room!.truth_pool.length
    : 0;
  const darePoolLength = Array.isArray(room?.dare_pool)
    ? room!.dare_pool.length
    : 0;
  const acknowledgedPartial = room?.acknowledged_partial_deck === true;
  const onePoolEmpty = truthPoolLength === 0 || darePoolLength === 0;
  const bothPoolsEmpty = truthPoolLength === 0 && darePoolLength === 0;
  /**
   * Low-deck / end flow. Must stay true when 0/0 and no card on screen (after Next),
   * otherwise nothing opens Oops and the UI dead-locks.
   */
  const endAfterThisTurn =
    !!room &&
    room.status === "playing" &&
    ((bothPoolsEmpty && !currentQuestion) ||
      (!!room.current_question &&
        (bothPoolsEmpty || (onePoolEmpty && !acknowledgedPartial))));
  const isMyTurn =
    !!myUserId && !!currentPlayer?.userId && currentPlayer.userId === myUserId;

  const playerStats = room?.player_stats ?? {};
  const awards: GameAwards = isGameOver
    ? computeAwards(
        playerList,
        Object.fromEntries(
          playerList.map((p) => [
            p.id,
            playerStats[p.id] ?? { truthCount: 0, dareCount: 0 },
          ]),
        ),
      )
    : { mostDaring: null, truthfulAngel: null, superstar: null };

  const showTruth = useCallback(async () => {
    if (!roomId || !isMyTurn || currentQuestion) return;
    await chooseTruthOrDareInRoom(roomId, "truth");
  }, [roomId, isMyTurn, currentQuestion]);

  const showDare = useCallback(async () => {
    if (!roomId || !isMyTurn || currentQuestion) return;
    await chooseTruthOrDareInRoom(roomId, "dare");
  }, [roomId, isMyTurn, currentQuestion]);

  const nextPlayer = useCallback(async () => {
    if (!roomId || !isMyTurn || !currentQuestion) return;
    await nextPlayerInRoom(roomId);
  }, [roomId, isMyTurn, currentQuestion]);

  const refreshAfterPremiumPurchase = useCallback(
    async (categoryId: string) => {
      if (!roomId || !isHost) return;
      const hasPremium = await hasPremiumQuestionsAccess(categoryId);
      if (!hasPremium) return;

      const allQuestions = await getQuestionsByCategory(categoryId, {
        includePremium: true,
      });
      await addQuestionsToRoomPools(roomId, allQuestions);
    },
    [roomId, isHost],
  );

  /**
   * Only the room host may update DB / broadcast. Verifies via auth + room row — not hook `isHost`
   * (that is false until `myUserId` loads, which blocked host updates before).
   */
  const notifyHostAway = useCallback(async (away: boolean) => {
    if (!roomId) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) return;
    const roomRow = await getRoomById(roomId);
    if (
      !roomRow?.host_user_id ||
      String(roomRow.host_user_id) !== String(user.id)
    ) {
      return;
    }
    try {
      await setRoomHostInExitMenu(roomId, away);
    } catch {
      /* ignore */
    }
    const trySend = async () => {
      const ch = gameChannelRef.current;
      if (!ch) return false;
      await ch.send({
        type: "broadcast",
        event: "host_away",
        payload: { away },
      });
      return true;
    };
    if (await trySend()) return;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 60));
      if (await trySend()) return;
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (mounted && user?.id) setMyUserId(user.id);

      const [roomData, roomPlayers] = await Promise.all([
        getRoomById(roomId),
        getRoomPlayers(roomId),
      ]);
      if (mounted) {
        if (roomData) {
          setRoom(roomData);
          setHostAwayBroadcast(isTruthyHostAway(roomData.host_in_exit_menu));
        }
        setPlayers(roomPlayers);
      }
    };

    init().finally(() => {
      if (mounted) setLoading(false);
    });

    const channel = supabase
      .channel(`game:${roomId}`, {
        config: { broadcast: { self: true } },
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        async () => {
          const r = await getRoomById(roomId);
          if (mounted && r) {
            setRoom(r);
            setHostAwayBroadcast(isTruthyHostAway(r.host_in_exit_menu));
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_room_players",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          const p = await getRoomPlayers(roomId);
          if (mounted) setPlayers(p);
        },
      )
      .on("broadcast", { event: "host_away" }, (msg: unknown) => {
        if (!mounted) return;
        const m = msg as Record<string, unknown>;
        const p = m.payload;
        const nestedAway =
          typeof p === "object" &&
          p !== null &&
          "away" in p &&
          (p as { away?: boolean }).away === true;
        const away = nestedAway || m.away === true;
        setHostAwayBroadcast(away);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          gameChannelRef.current = channel;
        }
      });

    return () => {
      mounted = false;
      gameChannelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  /**
   * Guests only: poll room row so `host_in_exit_menu` updates if Realtime misses updates.
   * Host skips this (early return) — avoids wasted requests and double state churn.
   */
  useEffect(() => {
    if (!roomId || !myUserId || !room?.host_user_id) return;
    if (String(room.host_user_id) === String(myUserId)) return;
    if (room.status !== "playing") return;

    const poll = async () => {
      const r = await getRoomById(roomId);
      if (!r) return;
      setRoom(r);
      setHostAwayBroadcast(isTruthyHostAway(r.host_in_exit_menu));
    };

    const id = setInterval(() => {
      void poll();
    }, 1_200);
    void poll();
    return () => clearInterval(id);
  }, [roomId, myUserId, room?.host_user_id, room?.status]);

  /** Host ended via Exit game — reload JS bundle so guest gets a clean app like the host. */
  useEffect(() => {
    if (!roomId || loading) return;
    if (!isDefinitelyGuest) return;
    if (room?.status !== "game_over") return;
    if (room?.host_exit_restart !== true) return;
    void reloadApp();
  }, [roomId, loading, isDefinitelyGuest, room?.status, room?.host_exit_restart]);

  return {
    players: playerList,
    currentPlayer,
    hasPlayers: players.length > 0,
    currentQuestion,
    categoryName,
    categoryId,
    isGameOver,
    endAfterThisTurn,
    awards,
    isHost,
    deckOopsPending,
    hostInExitMenu: hostInExitMenuDb,
    guestHostOverlayVisible,
    notifyHostAway,
    isMyTurn,
    loading,
    showTruth,
    showDare,
    nextPlayer,
    restartGameSession: () => {},
    refreshAfterPremiumPurchase,
    truthsLeft: truthPoolLength,
    daresLeft: darePoolLength,
  };
}
