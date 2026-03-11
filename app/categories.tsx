/**
 * Category selection screen: displays category bubbles from Supabase.
 * Free categories (love and relationships, funny, chaos) can start the game;
 * premium categories show a locked panel. On "Start Game" loads questions
 * and navigates to the game screen.
 */
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { CategoryBubbleButton } from "@/components/ui/CategoryBubbleButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  FREE_START_CATEGORY_NAMES,
  ORGANIC_CATEGORY_SLOTS,
} from "@/constants/category-bubbles";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { translateCategoryName } from "@/i18n";
import { useI18n } from "@/context/I18nContext";
import { useAutoDeselectAfterDelay } from "@/hooks/use-categories-lock-message";
import { useCategories } from "@/hooks/use-categories";
import { useDemoPurchases } from "@/hooks/use-demo-purchases";
import { getQuestionsByCategory } from "@/services/categories";
import { setGameCategory } from "@/services/game-session";
import type { CategoryBubble } from "@/types/category";

export default function CategoriesScreen() {
  const { t } = useI18n();
  const {
    categories,
    loading,
    questionsByCategory,
    handlePressCategory,
  } = useCategories();
  const { isCategoryUnlocked, refreshProStatus } = useDemoPurchases();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      refreshProStatus();
    }, [refreshProStatus])
  );

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
        isLocked:
          category.is_premium === true && !isCategoryUnlocked(category.id),
        sourceCategoryId: category.id,
      })),
    [categories, generatedSlots, isCategoryUnlocked],
  );

  const openCategory =
    bubbles.find((category) => category.id === selectedBubbleId) ?? null;
  const openLockedCategoryId = openCategory?.isLocked ? openCategory.id : null;
  const selectedCategoryName = openCategory?.name.toLowerCase().trim() ?? "";
  const isSelectedFreeCategory =
    FREE_START_CATEGORY_NAMES.has(selectedCategoryName);
  const canStartGame =
    openCategory !== null &&
    (isSelectedFreeCategory || isCategoryUnlocked(openCategory.id));

  useAutoDeselectAfterDelay(
    openLockedCategoryId,
    3500,
    setSelectedBubbleId
  );

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

  const handleGoBack = () => {
    router.replace("/add-players");
  };

  const handleShop = () => {
    router.push("/shop");
  };

  // Use cached questions if available, else fetch. Then save to game-session and start.
  const handleStartGame = async () => {
    if (!canStartGame || !openCategory) return;

    try {
      const cached = questionsByCategory[openCategory.id];
      const questions = cached ?? (await getQuestionsByCategory(openCategory.id));
      setGameCategory(openCategory.id, openCategory.name, questions);
      router.replace("/game");
    } catch (error) {
      console.log("Failed to load questions for game:", error);
    }
  };

  const handleBubblePress = (bubble: CategoryBubble) => {
    const isClosingCurrent = selectedBubbleId === bubble.id;
    setSelectedBubbleId(isClosingCurrent ? null : bubble.id);
    // Pre-load questions on select; clear selection state on deselect
    handlePressCategory(bubble.id);
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
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerSpacer} />
              <LanguageSwitcher />
            </View>
            <View style={styles.headerBottomRow}>
              <Pressable
                onPress={handleGoBack}
                style={styles.iconCircle}
                hitSlop={8}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={COLORS.textInverse}
                />
              </Pressable>
              <Text style={styles.title}>{t("categories.title")}</Text>
              <Pressable
                onPress={handleShop}
                style={styles.iconCircle}
                hitSlop={8}
                accessibilityLabel={t("categories.shopA11y")}
              >
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color={COLORS.textInverse}
                />
              </Pressable>
            </View>
          </View>

          <View
            style={[
              styles.field,
              { marginBottom: Math.max(112, insets.bottom + 92) },
            ]}
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
            <View
              style={[
                styles.panel,
                { bottom: Math.max(112, insets.bottom + 92) },
              ]}
            >
              <Text style={styles.panelTitle}>{translateCategoryName(openCategory.name, t)}</Text>
              <Text style={styles.panelText}>
                {t("categories.lockedMessage")}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.footerSection,
              { paddingBottom: Math.max(20, insets.bottom + 8) },
            ]}
          >
            <AppButton
              variant="cta"
              onPress={handleStartGame}
              disabled={!canStartGame}
            >
              {t("categories.startGame")}
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
  header: {
    marginBottom: SPACING.x1,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: SPACING.x2,
  },
  headerSpacer: {
    flex: 1,
  },
  headerBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...TYPOGRAPHY_BASE.h2,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    flex: 1,
  },
  field: {
    flex: 1,
    minHeight: 510,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(24, 4, 62, 0.52)",
    borderWidth: 1,
    borderColor: "rgba(245, 215, 255, 0.9)",
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
    ...TYPOGRAPHY_BASE.h2,
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
  footerSection: {
    position: "absolute",
    left: SPACING.x4,
    right: SPACING.x4,
    bottom: 0,
  },
});
