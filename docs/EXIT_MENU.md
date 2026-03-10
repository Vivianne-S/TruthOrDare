# Exit Menu Modal

## Overview

The Exit Menu Modal appears when the user taps the door icon on the game screen. It offers options to end the round: go back to categories, add more players, or exit the app.

**Component:** `components/ui/ExitMenuModal.tsx`

**Trigger:** Door icon (top-left) on game screen → `handleDoorPress` → `setShowExitMenu(true)`

---

## Modal Content

- **Title:** "End the round?"
- **Subtitle:** "Choose what you'd like to do."
- **Buttons:** Back to categories, Add more players, Exit Game
- **Cancel:** Text link at bottom

---

## Button Flows

### 1. Back to categories

- **Style:** Blue/cyan glow, `arrow-back-circle` icon
- **Action:** Close modal → `router.replace("/categories")`
- **Result:** User returns to category selection; game ends

---

### 2. Add more players

- **Style:** Purple glow, `person-add` icon
- **Action:** Close modal → `router.push("/add-players?addMore=true")`
- **Result:** User goes to add-players with current players pre-loaded

**Add-players in "add more" mode:**

- **Title:** "Add More Players"
- **Back button:** Chevron in header (cancels back to game)
- **Primary button:** "Back to game" (instead of "Select category")
- **Flow:** Add players → "Back to game" → `setGamePlayers(players)` → `router.replace("/game")`

---

### 3. Exit Game

- **Style:** Pink glow, `close-circle` icon
- **Action:** Close modal → `setShowExitConfirm(true)`
- **Result:** ExitConfirmModal appears

**ExitConfirmModal:**

- **Title:** "Exit game"
- **Message:** "Are you sure you want to close the game?"
- **No** (red): Close confirm → stay on game
- **Yes** (green): Close confirm → `router.replace("/")` → home screen

---

### 4. Cancel

- **Style:** Muted text (`textDisabled`)
- **Action:** Close modal → `setShowExitMenu(false)`
- **Result:** User stays on game screen

---

## Summary Table

| Button | Result |
|--------|--------|
| Back to categories | → Category selection (game ends) |
| Add more players | → Add-players (add more) → back to game |
| Exit Game | → Confirm modal → home (if Yes) |
| Cancel | → Close modal, stay on game |
