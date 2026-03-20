/**
 * Parses a QR payload from create-game (deep link) or a plain room code string.
 */
const CODE_LENGTH = 6;

export function extractRoomCodeFromScanPayload(data: string): string {
  const joinSegment = data.match(/\/join\/([a-zA-Z0-9]+)/i)?.[1];
  const base = (joinSegment ?? data).trim();
  return base.replace(/[^a-zA-Z0-9]/g, "").slice(0, CODE_LENGTH).toUpperCase();
}

export function isValidRoomCodeLength(code: string): boolean {
  return code.length === CODE_LENGTH;
}
