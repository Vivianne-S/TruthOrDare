/**
 * Multiplayer game hook: syncs game state from Supabase, exposes isMyTurn.
 * Only current player can choose Truth/Dare and press Next player.
 */
import { supabase } from "@/lib/supabase";
import { getQuestionsByCategory } from "@/services/categories";
import {
  addQuestionsToRoomPools,
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
import { computeAwards } from "@/utils/game-awards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export type { GameAwards };

export function useMultiplayerGame(roomId: string | undefined) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GameRoomPlayer[]>([]);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    !!room?.host_user_id && !!myUserId && room.host_user_id === myUserId;
  const deckOopsPending = room?.deck_oops_pending === true;
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
      const [proValue, pqValue] = await Promise.all([
        AsyncStorage.getItem("demo_pro_purchased"),
        AsyncStorage.getItem("demo_unlocked_premium_questions"),
      ]);
      const isPro = proValue === "true";
      const unlockedIds: string[] = pqValue ? JSON.parse(pqValue) : [];
      const hasPremium = isPro || unlockedIds.includes(categoryId);
      if (!hasPremium) return;

      const allQuestions = await getQuestionsByCategory(categoryId, {
        includePremium: true,
      });
      await addQuestionsToRoomPools(roomId, allQuestions);
    },
    [roomId, isHost],
  );

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
        {
          event: "*",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        async () => {
          const r = await getRoomById(roomId);
          if (mounted && r) setRoom(r);
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
    deckOopsPending,
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
