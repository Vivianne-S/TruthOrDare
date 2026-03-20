/**
 * Deep link target for room invites: /join/<roomCode> (e.g. truthordare://join/ABC123).
 * Same data as the shareable code; forwards to join-game with the code prefilled.
 */
import { Redirect, useLocalSearchParams } from "expo-router";

const CODE_LENGTH = 6;

function normalizeRoomCodeParam(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, CODE_LENGTH).toUpperCase();
}

export default function JoinByCodeDeepLinkScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const cleaned = normalizeRoomCodeParam(code);

  if (!cleaned) {
    return <Redirect href="/join-game" />;
  }

  return (
    <Redirect href={{ pathname: "/join-game", params: { code: cleaned } }} />
  );
}
