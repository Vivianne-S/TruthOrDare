/**
 * Multiplayer game hook: syncs game state from Supabase, exposes isMyTurn.
 * Only current player can choose Truth/Dare and press Next player.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  chooseTruthOrDareInRoom,
  getRoomById,
  getRoomPlayers,
  nextPlayerInRoom,
  roomPlayersToPlayers,
  type GameRoom,
  type GameRoomPlayer,
} from "@/services/game-room";
import type { Question } from "@/types/category";
import type { GameAwards } from "@/types/game";
import type { Player } from "@/types/player";
import { computeAwards } from "@/utils/game-awards";

export type { GameAwards };

export function useMultiplayerGame(roomId: string | undefined) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GameRoomPlayer[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const playerList = roomPlayersToPlayers(players);
  const currentPlayer =
    players.length > 0 && room
      ? playerList[room.current_player_index % players.length] ?? null
      : null;
  const currentQuestion = (room?.current_question ?? null) as Question | null;
  const categoryName = room?.category_name ?? null;
  const categoryId = room?.category_id ?? null;
  const isGameOver = room?.status === "game_over";
  const isHost =
    !!room?.host_user_id && !!myUserId && room.host_user_id === myUserId;
  const truthPoolLength = Array.isArray(room?.truth_pool)
    ? room!.truth_pool.length
    : 0;
  const darePoolLength = Array.isArray(room?.dare_pool)
    ? room!.dare_pool.length
    : 0;
  const endAfterThisTurn =
    !!room &&
    room.status === "playing" &&
    (truthPoolLength === 0 || darePoolLength === 0);
  const isMyTurn =
    !!myUserId &&
    !!currentPlayer?.userId &&
    currentPlayer.userId === myUserId;

  const playerStats = room?.player_stats ?? {};
  const awards: GameAwards = isGameOver
    ? computeAwards(
        playerList,
        Object.fromEntries(
          playerList.map((p) => [
            p.id,
            playerStats[p.id] ?? { truthCount: 0, dareCount: 0 },
          ])
        )
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
        if (roomData) setRoom(roomData);
        setPlayers(roomPlayers);
      }
    };

    init().finally(() => {
      if (mounted) setLoading(false);
    });

    const channel = supabase
      .channel(`game:${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` },
        async (payload) => {
          const r = payload.new as GameRoom;
          if (mounted && r) setRoom(r);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "game_room_players", filter: `room_id=eq.${roomId}` },
        async () => {
          const p = await getRoomPlayers(roomId);
          if (mounted) setPlayers(p);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

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
    isMyTurn,
    loading,
    showTruth,
    showDare,
    nextPlayer,
    restartGameSession: () => {},
    refreshAfterPremiumPurchase: undefined,
  };
}
