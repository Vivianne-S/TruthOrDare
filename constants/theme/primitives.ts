import { BASE_SPACING } from "./spacing";

// ===============================
// BORDER RADIUS
// ===============================
export const BORDER_RADIUS = {
  x0: 0,
  x1: BASE_SPACING * 1, // 4
  x2: BASE_SPACING * 2, // 8
  x3: BASE_SPACING * 3, // 12
  x4: BASE_SPACING * 4, // 16
  x5: BASE_SPACING * 5, // 20
  x6: BASE_SPACING * 6, // 24
  x7: BASE_SPACING * 7, // 28
  x8: BASE_SPACING * 8, // 32
  x10: BASE_SPACING * 10, // 40
  x12: BASE_SPACING * 12, // 48
  x14: BASE_SPACING * 14, // 56
  x16: BASE_SPACING * 16, // 64
  x18: BASE_SPACING * 18, // 72
  x20: BASE_SPACING * 20, // 80
  x22: BASE_SPACING * 22, // 88
  x24: BASE_SPACING * 24, // 96
  x26: BASE_SPACING * 26, // 104
  x28: BASE_SPACING * 28, // 112
  x30: BASE_SPACING * 30, // 120
  x32: BASE_SPACING * 32, // 128
  x34: BASE_SPACING * 34, // 136
  x36: BASE_SPACING * 36, // 144
  x38: BASE_SPACING * 38, // 152
  x40: BASE_SPACING * 40, // 160
  x42: BASE_SPACING * 42, // 168
  x44: BASE_SPACING * 44, // 176
  x46: BASE_SPACING * 46, // 184
  x48: BASE_SPACING * 48, // 192
  round: 9999, // Fully rounded
} as const;

// ===============================
// OPACITY
// ===============================
export const OPACITY = {
  disabled: 0.5,
  hover: 0.8,
  pressed: 0.6,
} as const;

// ===============================
// Z-INDEX
// ===============================
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const;