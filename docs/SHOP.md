# Shop Documentation

## Overview

The shop is implemented with RevenueCat (`react-native-purchases`). Users can buy:

- Pro entitlement (global unlock)
- Premium categories
- Premium question packs for free starter categories

The shop also supports the Out-of-Questions flow, where users jump directly to the relevant premium-question purchase.

---

## Core Implementation

### 1) Purchase hook (`use-revenuecat-purchases`)

- **File:** `hooks/use-revenuecat-purchases.ts`
- **Responsibilities:**
  - initialize RevenueCat (through `lib/revenuecat.ts`)
  - fetch customer info and offerings
  - expose entitlement checks (`isPro`, `isCategoryUnlocked`, `isPremiumQuestionsUnlocked`)
  - perform purchases by package id
  - expose `refreshProStatus()` and `resetPurchases()` for testing

### 2) Shop screen

- **File:** `app/shop.tsx`
- **Sections:**
  - Pro card
  - Premium categories
  - Premium question packs (for free categories)
- Uses `useShopCategories()` and `useRevenueCatPurchases()`.
- Shows success/failure feedback modals after purchase attempts.

### 3) Shop category source

- **File:** `hooks/use-shop-categories.ts`
- Builds two lists:
  - premium categories
  - free categories with purchasable premium question packs

### 4) RevenueCat identifiers

- **File:** `constants/revenuecat.ts`
- Defines package/entitlement id conventions:
  - `pro`
  - `category_<category_id>`
  - `premium_questions_<category_id>`

### 5) Integration with categories/game

- **Categories screen:** `app/categories.tsx` calls `refreshProStatus()` on focus.
- **Game screen:** `app/game.tsx` uses premium access checks to decide Out-of-Questions actions.
- **Access service:** `services/premium-questions-access.ts` checks demo keys first, then RevenueCat entitlements.

---

## Out-of-Questions Shop Flow

When opened from Out-of-Questions:

- Route params:
  - `fromOutOfQuestions=true`
  - `categoryId=<id>`
  - optional `roomId=<uuid>` for multiplayer
- Shop scrolls to the premium-questions section.
- The matching category button can blink to highlight the relevant package.

After a successful purchase:

- **Local:** game session can append premium questions and continue.
- **Multiplayer:** host appends questions to room pools so all clients continue via realtime sync.

---

## Notes

- `hooks/use-demo-purchases.ts` still exists for legacy/testing scenarios.
- Production shop/category flows use RevenueCat hook APIs.
