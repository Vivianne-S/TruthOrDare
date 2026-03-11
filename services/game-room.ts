/**
 * Game room service: create/join rooms via Supabase.
 * Uses anonymous auth. Tables: game_rooms, game_room_players.
 */
import { supabase } from "@/lib/supabase";
import type { Player } from "@/types/player";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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
  player_stats: Record<string, { truthCount: number; dareCount: number }>;
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
 */
export function roomPlayersToPlayers(
  roomPlayers: GameRoomPlayer[],
  hostUserId: string
): Player[] {
  return roomPlayers.map((rp) => ({
    id: rp.id,
    name: rp.name || "Player",
    avatarId: rp.avatar_id,
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
      async (payload) => {
        const room = payload.new as GameRoom;
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

  const { error } = await supabase
    .from("game_rooms")
    .update({
      status: "playing",
      category_id: categoryId,
      category_name: categoryName,
      game_questions: questions,
      truth_pool: truths,
      dare_pool: dares,
    })
    .eq("id", roomId);

  if (error) throw new Error(`Start game failed: ${error.message}`);
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
