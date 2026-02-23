import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryBubbleButton } from '@/components/ui/CategoryBubbleButton';
import { BubbleSlot, CATEGORY_BUBBLE_SLOTS } from '@/constants/category-bubbles';
import { COLORS } from '@/constants/theme/colors';
import { BORDER_RADIUS } from '@/constants/theme/primitives';
import { SPACING } from '@/constants/theme/spacing';
import { TYPOGRAPHY_BASE } from '@/constants/theme/typography';
import { useCategories } from '@/hooks/use-categories';

type CategoryBubble = {
  id: string;
  name: string;
  slot: BubbleSlot;
};

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

  const bubbles = useMemo<CategoryBubble[]>(
    () =>
      categories.map((category, i) => ({
        id: category.id,
        name: category.name,
        slot: CATEGORY_BUBBLE_SLOTS[i % CATEGORY_BUBBLE_SLOTS.length],
      })),
    [categories]
  );

  const openCategory = categories.find((c) => c.id === openCategoryId) ?? null;
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={COLORS.textInverse} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Select a Category</Text>

      <View
        style={styles.field}
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
        }}>
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
        <View style={[styles.panel, { bottom: Math.max(98, insets.bottom + 78) }]}>
          <Text style={styles.panelTitle}>{openCategory.name}</Text>
          {isLoadingQuestions ? (
            <ActivityIndicator size="small" color={COLORS.textPrimary} />
          ) : !hasOpenQuestions ? (
            <Text style={styles.panelText}>Loading questions...</Text>
          ) : openQuestions.length === 0 ? (
            <Text style={styles.panelText}>No questions found for this category.</Text>
          ) : (
            <ScrollView style={styles.questionsScroll} showsVerticalScrollIndicator={false}>
              {openQuestions.map((q, i) => (
                <Text key={`${openCategory.id}-${i}`} style={styles.panelText}>
                  {q.type.toUpperCase()}: {q.question_text}
                </Text>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: SPACING.x4,
    paddingBottom: SPACING.x6,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY_BASE.hero1,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.x3,
    textAlign: 'center',
  },
  field: {
    flex: 1,
    minHeight: 510,
  },
  panel: {
    position: 'absolute',
    left: SPACING.x4,
    right: SPACING.x4,
    borderRadius: BORDER_RADIUS.x5,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: 'rgba(34, 10, 64, 0.58)',
    padding: SPACING.x3,
    maxHeight: 280,
  },
  panelTitle: {
    ...TYPOGRAPHY_BASE.large,
    color: COLORS.textSecondary,
    fontWeight: '700',
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
});