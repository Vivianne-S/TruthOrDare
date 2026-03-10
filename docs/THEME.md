# Theme & Design System

## Overview

The app uses a dark theme with purple, pink, and blue accents. Design tokens live in `constants/theme/`.

---

## Colors

**File:** `constants/theme/colors.ts`

### Brand

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #A56BFF | Main purple |
| secondary | #FF4FD8 | Pink accent |
| accent | #FF8A4D | Orange accent |

### Backgrounds

| Token | Hex |
|-------|-----|
| backgroundPrimary | #14062B |
| backgroundSecondary | #1A0A36 |
| backgroundTertiary | #230E46 |

### Text

| Token | Hex |
|-------|-----|
| textPrimary | #F8EDFF |
| textSecondary | #DDC8F8 |
| textTertiary | #BFA9E4 |
| textDisabled | #8F74B3 |
| textInverse | #FFFFFF |

### State

| Token | Usage |
|-------|-------|
| success | #79C9FF (blue) |
| error | #FF6AAE (pink) |
| warning | #FFB36B (orange) |

---

## Spacing

**File:** `constants/theme/spacing.ts`

Uses `BASE_SPACING` (e.g. 4px). `SPACING.x1`, `SPACING.x2`, … scale up.

---

## Border Radius

**File:** `constants/theme/primitives.ts`

`BORDER_RADIUS.x3`, `x4`, `x6`, `x12`, `round` (9999).

---

## Typography

**File:** `constants/theme/typography/`

- **TYPOGRAPHY_BASE:** hero1, h2, h3, body, small, xSmall
- **FONT_FAMILY:** primary (regular, bold, extraBold)

---

## UI Components

### AppButton

**File:** `components/ui/AppButton.tsx`

**Variants:** glass, cta, pill, chip, fab, arrowNeon, truth, dare

- **truth/dare:** Blue/pink neon cards for game screen
- **pill:** Purple glow (shop, modals)
- **cta:** Pink CTA for primary actions
- **glass:** Subtle glass effect

### Modals

- **ExitMenuModal:** Gradient background, purple border, option buttons
- **ExitConfirmModal:** Dark background, red/green buttons

---

## Background Images

- `purple_galaxy.png` – Categories, shop, add-players
- `game_background.png` – Game screen
- `instruction_pic.png` – How-to-play
- `SplashBigger.png` – Splash
