import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { CategoryBubbleButton } from "@/components/ui/CategoryBubbleButton";
import {
  BubbleSlot,
  CATEGORY_BUBBLE_SLOTS,
} from "@/constants/category-bubbles";
import { useCategories } from "@/hooks/use-categories";

type CategoryBubble = {
  id: string;
  name: string;
  slot: BubbleSlot;
};

const FREE_CATEGORY_CONFIG = [
  {
    displayName: "Love & Relationships",
    aliases: new Set(["love relationships", "love and relationships"]),
  },
  {
    displayName: "Funny",
    aliases: new Set(["funny"]),
  },
  {
    displayName: "Chaos",
    aliases: new Set(["chaos"]),
  },
];

function normalizeCategoryName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CategoriesScreen() {
  const {
    categories,
    loading,
    openCategoryId,
    questionsByCategory,
    questionsLoadingByCategory,
    handlePressCategory,
  } = useCategories();
  const insets = useSafeAreaInsets();

  const touchX = useSharedValue(-1000);
  const touchY = useSharedValue(-1000);
  const touching = useSharedValue(0);
  const [fieldSize, setFieldSize] = useState({ width: 0, height: 0 });

  const freeCategories = useMemo(
    () =>
      FREE_CATEGORY_CONFIG.map((target) => {
        const match = categories.find((category) =>
          target.aliases.has(normalizeCategoryName(category.name))
        );
        if (!match) return null;
        return {
          ...match,
          name: target.displayName,
        };
      }).filter((category): category is { id: string; name: string } => category !== null),
    [categories]
  );

  const bubbles = useMemo<CategoryBubble[]>(
    () =>
      freeCategories.map((category, i) => ({
        id: category.id,
        name: category.name,
        slot: CATEGORY_BUBBLE_SLOTS[i % CATEGORY_BUBBLE_SLOTS.length],
      })),
    [freeCategories]
  );

  const openCategory =
    freeCategories.find((category) => category.id === openCategoryId) ?? null;
  const hasOpenQuestions =
    openCategoryId !== null &&
    Object.prototype.hasOwnProperty.call(questionsByCategory, openCategoryId);
  const openQuestions =
    openCategoryId && hasOpenQuestions ? questionsByCategory[openCategoryId] : [];
  const isLoadingQuestions =
    openCategoryId !== null && questionsLoadingByCategory[openCategoryId] === true;

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
    router.replace("/(tabs)");
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
                  slot={bubble.slot}
                  isOpen={openCategoryId === bubble.id}
                  onPress={() => handlePressCategory(bubble.id)}
                  fieldWidth={fieldSize.width}
                  fieldHeight={fieldSize.height}
                  touchX={touchX}
                  touchY={touchY}
                  touching={touching}
                />
              ))}
          </View>

          {openCategory && (
            <View style={[styles.panel, { bottom: Math.max(112, insets.bottom + 92) }]}>
              <Text style={styles.panelTitle}>{openCategory.name}</Text>
              {isLoadingQuestions ? (
                <ActivityIndicator size="small" color="#F8EDFF" />
              ) : !hasOpenQuestions ? (
                <Text style={styles.panelText}>Loading questions...</Text>
              ) : openQuestions.length === 0 ? (
                <Text style={styles.panelText}>
                  No questions found for this category.
                </Text>
              ) : (
                <ScrollView
                  style={styles.questionsScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {openQuestions.map((question, i) => (
                    <Text key={`${openCategory.id}-${i}`} style={styles.panelText}>
                      {question.type.toUpperCase()}: {question.question_text}
                    </Text>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          <View style={[styles.footerSection, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>
            <AppButton variant="cta" onPress={handleStartGame}>
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#F8EDFF",
    marginBottom: 14,
    textAlign: "center",
  },
  field: {
    flex: 1,
    minHeight: 510,
  },
  panel: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 149, 245, 0.48)",
    backgroundColor: "rgba(34, 10, 64, 0.58)",
    padding: 14,
    maxHeight: 280,
  },
  panelTitle: {
    color: "#FFD3F5",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  panelText: {
    color: "#F7E8FF",
    marginBottom: 6,
    lineHeight: 20,
  },
  questionsScroll: {
    maxHeight: 215,
  },
  footerSection: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
  },
});
