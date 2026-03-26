# Truth Or Dare

Truth Or Dare is a mobile party game built with Expo + React Native.
Players can set up avatars, choose categories, and play Truth/Dare rounds in local mode or multiplayer rooms.

## Highlights

- Local and multiplayer game sessions
- Supabase-backed categories and question decks
- Premium content and entitlement checks via RevenueCat
- Session-safe no-repeat question handling
- Optional text-to-speech for question prompts
- Game-over awards (Dare Devil, Truthful Angel, Best of Both Worlds)
- English/Swedish language support

## Tech Stack

- `Expo` + `React Native` + `TypeScript`
- `expo-router` (file-based navigation)
- `Supabase` (data + realtime multiplayer)
- `react-native-purchases` / RevenueCat (in-app purchases)

## Project Structure

```txt
TruthOrDare/
├── app/             # Screens and routes (expo-router)
├── components/      # Shared UI/game components
├── hooks/           # Custom hooks
├── services/        # Data/business logic integrations
├── constants/       # Theme tokens and static config
├── context/         # App-level context providers (e.g. i18n)
├── docs/            # Technical documentation
└── scripts/         # Utility scripts (e.g. question import/update)
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file with:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

RevenueCat (at least one option):

```bash
EXPO_PUBLIC_RC_TEST_API_KEY=...
# or
EXPO_PUBLIC_RC_IOS_API_KEY=...
EXPO_PUBLIC_RC_ANDROID_API_KEY=...
```

### 3) Start the app

```bash
npx expo start
```

Then open it in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Useful Scripts

```bash
npm run start
npm run start:dev
npm run start:localhost
npm run lint
npm run lint:fix
npm run typecheck
npm run update-questions-sv
```

## Documentation

Full technical docs are in [`docs/`](./docs/):

- [`docs/README.md`](./docs/README.md) - Documentation index
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) - Tech stack and structure
- [`docs/NAVIGATION.md`](./docs/NAVIGATION.md) - Screen and route map
- [`docs/GAME_FLOW.md`](./docs/GAME_FLOW.md) - Local/multiplayer flows
- [`docs/SHOP.md`](./docs/SHOP.md) - RevenueCat and shop behavior

## Companion Web Landing

This mobile app has a separate companion web landing page project used for presentation and app promotion.
https://github.com/Vivianne-S/truthordarewebb.git
