# Shop – Documentation

## Overview

The shop feature in the Truth Or Dare app lets users purchase premium categories and a Pro bundle. Since this is a school project, a **demo solution** is used – purchases are stored locally without real payments (no Apple/Google purchases or RevenueCat).

---

## What Has Been Implemented

### 1. Demo Purchases (use-demo-purchases)

- **File:** `hooks/use-demo-purchases.ts`
- **Purpose:** Simulates purchases without real payments.
- **Storage:** AsyncStorage – purchases persist across app restarts.
- **Supports:**
  - **Pro ($29.99):** Unlocks all premium categories.
  - **Individual categories ($4.99):** Unlocks a specific category.
- **Functions:**
  - `isPro` – whether Pro has been purchased
  - `isCategoryUnlocked(categoryId)` – whether a category is unlocked (Pro or individual purchase)
  - `unlockPremium()` – purchases Pro
  - `unlockCategory(id)` – purchases a category
  - `resetPurchases()` – resets all purchases (for development/testing)

### 2. Shop Screen

- **File:** `app/shop.tsx`
- **Content:**
  - **Pro card:** Truth Or Dare Pro – "Unlock all premium categories. Best value!" with price $29.99 and "Buy Premium".
  - **Premium categories:** List of each premium category ($4.99) with a "Buy" button.
  - **Reset Purchases (dev):** Button at the bottom to reset purchases during development.
- **Design:** Same theme as the rest of the app (purple galaxy background, cards with light borders).
- **UI details:**
  - Category name with `flex: 1` so price and button fit.
  - Price $4.99 with `marginLeft: SPACING.x6` for clear separation from the name.
  - "Owned" badge with checkmark for already purchased categories/Pro.

### 3. Shop Categories (use-shop-categories)

- **File:** `hooks/use-shop-categories.ts`
- **Purpose:** Fetches premium categories without duplicate API calls.
- **Implementation:** Uses `useCategories()` and filters on `is_premium === true`.

### 4. Constants

- **File:** `constants/shop.ts`
  - `CATEGORY_PRICE = "$4.99"`
  - `PREMIUM_PRICE = "$29.99"`

### 5. Integration with Categories Screen

- **File:** `app/categories.tsx`
- **Flow:**
  - `useFocusEffect` calls `refreshProStatus()` when the screen is focused (e.g. after leaving the shop).
  - Locked categories show a panel with: "This category is locked for now. Visit the shop to unlock it."
  - "Go to Shop" button navigates to `/shop`.
- **Lock logic:** `isLocked = category.is_premium && !isCategoryUnlocked(category.id)`.

### 6. Routing

- **File:** `app/_layout.tsx`
- Shop registered as `shop` with `headerShown: false` (custom header in shop.tsx).

---

## File Overview

| File | Role |
|------|------|
| `app/shop.tsx` | Shop screen with Pro and premium categories |
| `hooks/use-demo-purchases.ts` | Demo purchases with AsyncStorage |
| `hooks/use-shop-categories.ts` | Premium categories for the shop |
| `constants/shop.ts` | Prices ($4.99, $29.99) |
| `app/categories.tsx` | Locked categories + "Go to Shop" |

---

## Flow

1. User selects a locked premium category on the categories screen.
2. Panel is shown: "This category is locked for now. Visit the shop to unlock it."
3. User taps "Go to Shop" → navigates to shop.
4. User purchases Pro or an individual category (demo – no real payment).
5. Purchase is saved to AsyncStorage.
6. User goes back to the categories screen.
7. `useFocusEffect` triggers `refreshProStatus()` → purchase status is updated.
8. Category appears as unlocked and the game can be started.

---

## Future Extensions (Real Purchases)

To switch to real purchases (e.g. RevenueCat or StoreKit):

1. Replace `useDemoPurchases` with a hook that talks to the payment API.
2. Keep the same interface: `isCategoryUnlocked`, `unlockCategory`, `unlockPremium`.
3. Update `constants/shop.ts` if needed.
4. Remove or hide "Reset Purchases (dev)" in production.
