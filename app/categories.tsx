import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { CategoryBubbleButton } from "@/components/ui/CategoryBubbleButton";
import { BubbleSlot } from "@/constants/category-bubbles";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useCategories } from "@/hooks/use-categories";

type CategoryBubble = {
  id: string;
  name: string;
  icon: string | null;
  slot: BubbleSlot;
  isLocked: boolean;
  sourceCategoryId: string;
};

const FREE_START_CATEGORY_NAMES = new Set([
  "love and relationships",
  "funny",
  "chaos",
]);

const ORGANIC_CATEGORY_SLOTS: BubbleSlot[] = [
  { x: 0.06, y: 0.22, size: 124 },
  { x: 0.39, y: 0.07, size: 88 },
  { x: 0.70, y: 0.04, size: 86 },
  { x: 0.06, y: 0.03, size: 84 },
  { x: 0.47, y: 0.23, size: 94 },
  { x: 0.38, y: 0.42, size: 90 },
  { x: 0.06, y: 0.45, size: 92 },
  { x: 0.74, y: 0.22, size: 86 },
  { x: 0.04, y: 0.67, size: 86 },
  { x: 0.35, y: 0.60, size: 92 },
  { x: 0.66, y: 0.45, size: 120 },
  { x: 0.28, y: 0.79, size: 102 },
  { x: 0.62, y: 0.71, size: 88 },
];

export default function CategoriesScreen() {
  const {
    categories,
    loading,
  } = useCategories();
  const insets = useSafeAreaInsets();

  const touchX = useSharedValue(-1000);
  const touchY = useSharedValue(-1000);
  const touching = useSharedValue(0);
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 });
  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);

  const generatedSlots = useMemo(() => ORGANIC_CATEGORY_SLOTS, []);

  const bubbles = useMemo<CategoryBubble[]>(
    () =>
      categories.map((category, i) => ({
        id: category.id,
        name: category.name,
        icon: category.icon ?? null,
        slot: generatedSlots[i % generatedSlots.length],
        isLocked: category.is_premium === true,
        sourceCategoryId: category.id,
      })),
    [categories, generatedSlots]
  );

  const openCategory =
    bubbles.find((category) => category.id === selectedBubbleId) ?? null;
  const openLockedCategoryId = openCategory?.isLocked ? openCategory.id : null;
  const selectedCategoryName = openCategory?.name.toLowerCase().trim() ?? "";
  const isSelectedFreeCategory = FREE_START_CATEGORY_NAMES.has(selectedCategoryName);
  // TODO: Replace with real ownership check when shop purchases are implemented.
  const isSelectedPremiumAndOwned = false;
  const canStartGame =
    openCategory !== null && (isSelectedFreeCategory || isSelectedPremiumAndOwned);

  useEffect(() => {
    if (!openLockedCategoryId) return;
    const timeoutId = setTimeout(() => {
      setSelectedBubbleId((current) =>
        current === openLockedCategoryId ? null : current
      );
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [openLockedCategoryId]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFieldSize({ width, height });
  };

  const updateTouch = (event: {
    nativeEvent: { locationX: number; locationY: number };
  }) => {
    touchX.value = event.nativeEvent.locationX;
    touchY.value = event.nativeEvent.locationY;
  };

  const handleStartGame = () => {
    if (!canStartGame) return;
    router.replace("/(tabs)");
  };

  const handleBubblePress = (bubble: CategoryBubble) => {
    const isClosingCurrent = selectedBubbleId === bubble.id;
    setSelectedBubbleId(isClosingCurrent ? null : bubble.id);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/purple_galaxy.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.screen}>
          <Text style={styles.title}>Select a Category</Text>

          <View
            style={[styles.field, { marginBottom: Math.max(112, insets.bottom + 92) }]}
            onLayout={handleLayout}
            onTouchStart={(event) => {
              touching.value = 1;
              updateTouch(event);
            }}
            onTouchMove={updateTouch}
            onTouchEnd={() => {
              touching.value = 0;
              touchX.value = -1000;
              touchY.value = -1000;
            }}
            onTouchCancel={() => {
              touching.value = 0;
              touchX.value = -1000;
              touchY.value = -1000;
            }}
          >
            {fieldSize.width > 0 &&
              bubbles.map((bubble) => (
                <CategoryBubbleButton
                  key={bubble.id}
                  name={bubble.name}
                  icon={bubble.icon}
                  slot={bubble.slot}
                  isOpen={selectedBubbleId === bubble.id}
                  isLocked={bubble.isLocked}
                  onPress={() => handleBubblePress(bubble)}
                  fieldWidth={fieldSize.width}
                  fieldHeight={fieldSize.height}
                  touchX={touchX}
                  touchY={touchY}
                  touching={touching}
                />
              ))}
          </View>

          {openCategory?.isLocked && (
            <View style={[styles.panel, { bottom: Math.max(112, insets.bottom + 92) }]}>
              <Text style={styles.panelTitle}>{openCategory.name}</Text>
              <Text style={styles.panelText}>
                This category is locked for now. Visit the shop to unlock it.
              </Text>
            </View>
          )}

          <View style={[styles.footerSection, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
            <AppButton variant="cta" onPress={handleStartGame} disabled={!canStartGame}>
              Start Game
            </AppButton>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },
  screen: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: SPACING.x4,
    paddingBottom: SPACING.x6,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...TYPOGRAPHY_BASE.hero1,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.x1,
    textAlign: "center",
  },
  field: {
    flex: 1,
    minHeight: 510,
  },
  panel: {
    position: "absolute",
    left: SPACING.x4,
    right: SPACING.x4,
    borderRadius: BORDER_RADIUS.x5,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: "rgba(34, 10, 64, 0.58)",
    padding: SPACING.x3,
    maxHeight: 280,
  },
  panelTitle: {
    ...TYPOGRAPHY_BASE.large,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginBottom: SPACING.x2,
  },
  panelText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    marginBottom: SPACING.x1,
    lineHeight: 20,
  },
  questionsScroll: {
    maxHeight: 215,
  },
  footerSection: {
    position: "absolute",
    left: SPACING.x4,
    right: SPACING.x4,
    bottom: 0,
  },
});
