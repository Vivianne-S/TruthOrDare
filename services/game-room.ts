/**
 * Game room service: create/join rooms via Supabase.
 * Uses anonymous auth. Tables: game_rooms, game_room_players.
 */
import { supabase } from "@/lib/supabase";
import type { Player } from "@/types/player";
import type { Question } from "@/types/category";
import { shuffleArray } from "@/utils/shuffle";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** True when DB has not run migration for `acknowledged_partial_deck` (column missing). */
function isAcknowledgedColumnMissingError(error: {
  message?: string;
  code?: string;
} | null): boolean {
  if (!error) return false;
  const msg = (error.message ?? "").toLowerCase();
  return (
    error.code === "42703" ||
    msg.includes("acknowledged_partial_deck") ||
    (msg.includes("column") &&
      (msg.includes("does not exist") ||
        msg.includes("unknown column") ||
        msg.includes("schema cache")))
  );
}

/** True when DB has not run migration for `deck_oops_pending` (column missing). */
function isDeckOopsColumnMissingError(error: {
  message?: string;
  code?: string;
} | null): boolean {
  if (!error) return false;
  const msg = (error.message ?? "").toLowerCase();
  return (
    error.code === "42703" ||
    msg.includes("deck_oops_pending") ||
    (msg.includes("column") &&
      (msg.includes("does not exist") ||
        msg.includes("unknown column") ||
        msg.includes("schema cache")))
  );
}

export type GameRoom = {
  id: string;
  code: string;
  host_user_id: string;
  status: "lobby" | "playing" | "game_over";
  category_id: string | null;
  category_name: string | null;
  game_questions: unknown[];
  truth_pool: unknown[];
  dare_pool: unknown[];
  current_player_index: number;
  current_question?: { type: string; question_text: string; question_text_sv?: string | null } | null;
  current_choice?: "truth" | "dare" | null;
  player_stats: Record<string, { truthCount: number; dareCount: number }>;
  /** True after host chose "Continue" while one pool was still non-empty; Oops modal only returns at 0/0. */
  acknowledged_partial_deck?: boolean;
  /** Non-host pressed Next when the deck needs host-only Oops; host client opens the modal. */
  deck_oops_pending?: boolean;
  created_at: string;
};

export type GameRoomPlayer = {
  id: string;
  room_id: string;
  user_id: string;
  name: string;
  avatar_id: number;
  joined_at: string;
};

function generateRoomCode(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return result;
}

async function ensureAnonymousSession(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) return session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw new Error(`Auth failed: ${error.message}`);
  if (!data.user?.id) throw new Error("Anonymous sign-in did not return user id");
  return data.user.id;
}

/**
 * Create a new game room. Host is added as first player.
 */
export async function createGameRoom(hostName: string, hostAvatarId: number): Promise<{
  room: GameRoom;
  roomCode: string;
}> {
  const userId = await ensureAnonymousSession();

  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateRoomCode(6);
    const { data: existing } = await supabase
      .from("game_rooms")
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (!existing) break;
    attempts++;
  } while (attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error("Could not generate unique room code");
  }

  const { data: room, error: roomError } = await supabase
    .from("game_rooms")
    .insert({
      code,
      host_user_id: userId,
      status: "lobby",
    })
    .select()
    .single();

  if (roomError) throw new Error(`Create room failed: ${roomError.message}`);
  if (!room) throw new Error("Room insert did not return data");

  const { error: playerError } = await supabase.from("game_room_players").insert({
    room_id: room.id,
    user_id: userId,
    name: hostName || "Host",
    avatar_id: hostAvatarId,
  });

  if (playerError) {
    await supabase.from("game_rooms").delete().eq("id", room.id);
    throw new Error(`Add host failed: ${playerError.message}`);
  }

  return { room: room as GameRoom, roomCode: code };
}

/**
 * Join a game room by code. Returns room and adds current user as player.
 */
export async function joinGameRoom(
  code: string,
  playerName: string,
  avatarId: number
): Promise<{ room: GameRoom; playerId: string }> {
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length !== 6) {
    throw new Error("Invalid room code");
  }

  const userId = await ensureAnonymousSession();

  const { data: room, error: roomError } = await supabase
    .from("game_rooms")
    .select("*")
    .eq("code", trimmed)
    .eq("status", "lobby")
    .maybeSingle();

  if (roomError) throw new Error(`Lookup failed: ${roomError.message}`);
  if (!room) throw new Error("Room not found or game already started");

  const { data: existing } = await supabase
    .from("game_room_players")
    .select("id")
    .eq("room_id", room.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return { room: room as GameRoom, playerId: existing.id };
  }

  const { data: player, error: playerError } = await supabase
    .from("game_room_players")
    .insert({
      room_id: room.id,
      user_id: userId,
      name: playerName || "Player",
      avatar_id: avatarId,
    })
    .select("id")
    .single();

  if (playerError) throw new Error(`Join failed: ${playerError.message}`);
  return { room: room as GameRoom, playerId: player.id };
}

/**
 * Get room by id.
 */
export async function getRoomById(roomId: string): Promise<GameRoom | null> {
  const { data, error } = await supabase
    .from("game_rooms")
    .select("*")
    .eq("id", roomId)
    .maybeSingle();

  if (error) return null;
  return data as GameRoom | null;
}

/**
 * Get room by code (for validation before join).
 */
export async function getRoomByCode(code: string): Promise<GameRoom | null> {
  const trimmed = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from("game_rooms")
    .select("*")
    .eq("code", trimmed)
    .maybeSingle();

  if (error) return null;
  return data as GameRoom | null;
}

/**
 * Get players in a room.
 */
export async function getRoomPlayers(roomId: string): Promise<GameRoomPlayer[]> {
  const { data, error } = await supabase
    .from("game_room_players")
    .select("*")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (error) throw new Error(`Get players failed: ${error.message}`);
  return (data ?? []) as GameRoomPlayer[];
}

/**
 * Convert game_room_players to Player[] for game-session.
 * Includes userId for multiplayer "is my turn" check.
 */
export function roomPlayersToPlayers(
  roomPlayers: GameRoomPlayer[],
  _hostUserId?: string
): Player[] {
  return roomPlayers.map((rp) => ({
    id: rp.id,
    name: rp.name || "Player",
    avatarId: rp.avatar_id,
    userId: rp.user_id,
  }));
}

/**
 * Subscribe to room changes (realtime).
 */
export function subscribeToRoom(
  roomId: string,
  onRoom: (room: GameRoom) => void,
  onPlayers: (players: GameRoomPlayer[]) => void
) {
  const roomChannel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_rooms", filter: `id=eq.${roomId}` },
      async () => {
        // Refetch full row: realtime UPDATE payloads may omit unchanged columns, which
        // would drop truth_pool / dare_pool from merged UI state if used raw.
        const room = await getRoomById(roomId);
        if (room) onRoom(room);
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_room_players", filter: `room_id=eq.${roomId}` },
      async () => {
        const players = await getRoomPlayers(roomId);
        onPlayers(players);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(roomChannel);
  };
}

/**
 * Update room with category and start game (status=playing).
 */
export async function startGameInRoom(
  roomId: string,
  categoryId: string,
  categoryName: string,
  questions: { type: string; question_text: string; question_text_sv?: string | null }[]
): Promise<void> {
  const truths = questions.filter((q) => q.type.toLowerCase().trim() === "truth");
  const dares = questions.filter((q) => q.type.toLowerCase().trim() === "dare");

  const baseUpdate = {
    status: "playing" as const,
    category_id: categoryId,
    category_name: categoryName,
    game_questions: questions,
    truth_pool: truths,
    dare_pool: dares,
    current_player_index: 0,
    current_question: null,
    current_choice: null,
  };

  const withOptionals = {
    ...baseUpdate,
    acknowledged_partial_deck: false,
    deck_oops_pending: false,
  };

  let { error } = await supabase.from("game_rooms").update(withOptionals).eq("id", roomId);

  if (error && isDeckOopsColumnMissingError(error)) {
    const { deck_oops_pending: _d, ...noDeck } = withOptionals;
    const second = await supabase.from("game_rooms").update(noDeck).eq("id", roomId);
    error = second.error;
  }

  if (error && isAcknowledgedColumnMissingError(error)) {
    const second = await supabase.from("game_rooms").update(baseUpdate).eq("id", roomId);
    error = second.error;
  }

  if (error) throw new Error(`Start game failed: ${error.message}`);
}

type QuestionLike = { type: string; question_text: string; question_text_sv?: string | null };

/**
 * Append newly available questions to a playing room's pools.
 * Used when host unlocks premium questions mid-game.
 */
export async function addQuestionsToRoomPools(
  roomId: string,
  questions: Question[]
): Promise<void> {
  const room = await getRoomById(roomId);
  if (!room || room.status !== "playing") return;

  const existing = new Set(
    ((room.game_questions ?? []) as QuestionLike[]).map((q) => q.question_text)
  );
  const newTruths = questions.filter(
    (q) =>
      q.type.toLowerCase().trim() === "truth" && !existing.has(q.question_text)
  );
  const newDares = questions.filter(
    (q) =>
      q.type.toLowerCase().trim() === "dare" && !existing.has(q.question_text)
  );

  if (newTruths.length === 0 && newDares.length === 0) return;

  const appendedQuestions: QuestionLike[] = [
    ...newTruths.map((q) => ({
      type: q.type,
      question_text: q.question_text,
      question_text_sv: q.question_text_sv ?? null,
    })),
    ...newDares.map((q) => ({
      type: q.type,
      question_text: q.question_text,
      question_text_sv: q.question_text_sv ?? null,
    })),
  ];

  const newTruthPool = [
    ...((room.truth_pool ?? []) as QuestionLike[]),
    ...shuffleArray(appendedQuestions.filter((q) => q.type.toLowerCase().trim() === "truth")),
  ];
  const newDarePool = [
    ...((room.dare_pool ?? []) as QuestionLike[]),
    ...shuffleArray(appendedQuestions.filter((q) => q.type.toLowerCase().trim() === "dare")),
  ];

  const poolUpdate = {
    game_questions: [
      ...((room.game_questions ?? []) as QuestionLike[]),
      ...appendedQuestions,
    ],
    truth_pool: newTruthPool,
    dare_pool: newDarePool,
  };

  const poolWithFlags = {
    ...poolUpdate,
    acknowledged_partial_deck: false,
    deck_oops_pending: false,
  };

  let { error } = await supabase.from("game_rooms").update(poolWithFlags).eq("id", roomId);

  if (error && isDeckOopsColumnMissingError(error)) {
    const { deck_oops_pending: _d, ...noDeck } = poolWithFlags;
    const second = await supabase.from("game_rooms").update(noDeck).eq("id", roomId);
    error = second.error;
  }

  if (error && isAcknowledgedColumnMissingError(error)) {
    const second = await supabase.from("game_rooms").update(poolUpdate).eq("id", roomId);
    error = second.error;
  }

  if (error) throw new Error(`Add questions failed: ${error.message}`);
}

/**
 * After "Continue game" when one pool was empty: skip Oops until both pools hit 0.
 */
export async function setRoomAcknowledgedPartialDeck(
  roomId: string,
  acknowledged: boolean
): Promise<void> {
  const { error } = await supabase
    .from("game_rooms")
    .update({ acknowledged_partial_deck: acknowledged })
    .eq("id", roomId);
  if (error && isAcknowledgedColumnMissingError(error)) {
    return;
  }
  if (error) {
    throw new Error(`Update acknowledged_partial_deck failed: ${error.message}`);
  }
}

/**
 * Non-host signals that "Next" was pressed while the deck needs the host-only Oops flow.
 * Host clients should open OutOfQuestions when this is true and end conditions match.
 */
export async function setRoomDeckOopsPending(
  roomId: string,
  pending: boolean
): Promise<void> {
  const { error } = await supabase
    .from("game_rooms")
    .update({ deck_oops_pending: pending })
    .eq("id", roomId);
  if (error && isDeckOopsColumnMissingError(error)) {
    return;
  }
  if (error) {
    throw new Error(`Update deck_oops_pending failed: ${error.message}`);
  }
}

export async function endGameInRoom(roomId: string): Promise<void> {
  let { error } = await supabase
    .from("game_rooms")
    .update({ status: "game_over", deck_oops_pending: false })
    .eq("id", roomId);

  if (error && isDeckOopsColumnMissingError(error)) {
    const second = await supabase
      .from("game_rooms")
      .update({ status: "game_over" })
      .eq("id", roomId);
    error = second.error;
  }

  if (error) throw new Error(`End game failed: ${error.message}`);
}

/**
 * Current player chooses Truth or Dare. Pops from pool, updates room.
 * Only the current player should call this.
 */
export async function chooseTruthOrDareInRoom(
  roomId: string,
  type: "truth" | "dare"
): Promise<void> {
  const room = await getRoomById(roomId);
  if (!room || room.status !== "playing") throw new Error("Room not found or not playing");

  const players = await getRoomPlayers(roomId);
  const idx = room.current_player_index % players.length;
  const currentPlayerId = players[idx]?.id;
  if (!currentPlayerId) throw new Error("No current player");

  const truthPool = (room.truth_pool ?? []) as QuestionLike[];
  const darePool = (room.dare_pool ?? []) as QuestionLike[];
  const pool = type === "truth" ? truthPool : darePool;

  if (pool.length === 0) {
    // Other pool may still have cards; UI disables empty choice. Avoid ending the game here.
    return;
  }

  const question = pool[0];
  const newPool = pool.slice(1);
  const newTruthPool = type === "truth" ? newPool : truthPool;
  const newDarePool = type === "dare" ? newPool : darePool;

  const stats = room.player_stats ?? {};
  const playerStats = stats[currentPlayerId] ?? { truthCount: 0, dareCount: 0 };
  if (type === "truth") playerStats.truthCount += 1;
  else playerStats.dareCount += 1;
  const newStats = { ...stats, [currentPlayerId]: playerStats };

  const { error } = await supabase
    .from("game_rooms")
    .update({
      truth_pool: newTruthPool,
      dare_pool: newDarePool,
      current_question: question,
      current_choice: type,
      player_stats: newStats,
    })
    .eq("id", roomId);

  if (error) throw new Error(`Choose failed: ${error.message}`);
}

/**
 * Advance to next player. Clears current question. Only current player should call.
 */
export async function nextPlayerInRoom(roomId: string): Promise<void> {
  const room = await getRoomById(roomId);
  if (!room || room.status !== "playing") throw new Error("Room not found or not playing");

  const players = await getRoomPlayers(roomId);
  if (players.length === 0) return;

  const newIndex = (room.current_player_index + 1) % players.length;

  let { error } = await supabase
    .from("game_rooms")
    .update({
      current_player_index: newIndex,
      current_question: null,
      current_choice: null,
      deck_oops_pending: false,
    })
    .eq("id", roomId);

  if (error && isDeckOopsColumnMissingError(error)) {
    const second = await supabase
      .from("game_rooms")
      .update({
        current_player_index: newIndex,
        current_question: null,
        current_choice: null,
      })
      .eq("id", roomId);
    error = second.error;
  }

  if (error) throw new Error(`Next player failed: ${error.message}`);
}

/**
 * Update current user's name/avatar in the room.
 */
export async function updateMyPlayerInRoom(
  roomId: string,
  name: string,
  avatarId: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return;

  await supabase
    .from("game_room_players")
    .update({ name, avatar_id: avatarId })
    .eq("room_id", roomId)
    .eq("user_id", user.id);
}
