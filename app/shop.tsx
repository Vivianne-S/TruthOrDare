/**
 * Shop screen: premium category and package purchases via RevenueCat.
 * When opened from "Buy more" (out of questions), scrolls to Extra Questions
 * and highlights the current category's Buy button.
 */
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useRevenueCatPurchases } from "@/hooks/use-revenuecat-purchases";
import { useShopCategories } from "@/hooks/use-shop-categories";

function BlinkingBuyButton({
  shouldBlink,
  owned,
  onPress,
  disabled,
  loading,
  price,
  categoryName,
  packageLabel,
  buyLabel,
  ownedLabel,
}: {
  shouldBlink: boolean;
  owned: boolean;
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
  price: string;
  categoryName: string;
  packageLabel: string;
  buyLabel: string;
  ownedLabel: string;
}) {
  const opacity = useSharedValue(1);
  useEffect(() => {
    if (shouldBlink) {
      opacity.value = withRepeat(
        withTiming(0.5, { duration: 600 }),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(1);
    }
  }, [shouldBlink, opacity]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return (
    <View style={styles.categoryCard}>
      <View style={styles.premiumQuestionsCardContent}>
        <Text style={styles.premiumQuestionsCategoryName}>
          {categoryName}
        </Text>
        <Text style={styles.premiumQuestionsPackage}>
          {packageLabel}
        </Text>
      </View>
      <Text style={styles.categoryPrice}>{price}</Text>
      {owned ? (
        <View style={styles.ownedBadge}>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={COLORS.success}
          />
          <Text style={styles.ownedTextSmall}>{ownedLabel}</Text>
        </View>
      ) : (
        <Animated.View style={animatedStyle}>
          <AppButton
            variant="pill"
            size="small"
            onPress={onPress}
            disabled={disabled}
            loading={loading}
          >
            {buyLabel}
          </AppButton>
        </Animated.View>
      )}
    </View>
  );
}

export default function ShopScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { categoryId: paramCategoryId, fromOutOfQuestions } =
    useLocalSearchParams<{
      categoryId?: string;
      fromOutOfQuestions?: string;
      roomId?: string;
    }>();
  const scrollRef = useRef<ScrollView>(null);
  const [extraQuestionsSectionY, setExtraQuestionsSectionY] = useState<
    number | null
  >(null);
  const [purchaseCompleted, setPurchaseCompleted] = useState<{
    returnToGame: boolean;
  } | null>(null);
  const [purchaseFailed, setPurchaseFailed] = useState(false);
  const shouldReturnToGame = fromOutOfQuestions === "true" && !!paramCategoryId;

  const {
    isPro,
    isCategoryUnlocked,
    isPremiumQuestionsUnlocked,
    unlockCategory,
    unlockPremium,
    unlockPremiumQuestionsForCategory,
    resetPurchases,
    loading: purchasesLoading,
  } = useRevenueCatPurchases();
  const {
    premiumCategories,
    freeCategoriesWithPremiumQuestions,
    loading: categoriesLoading,
  } = useShopCategories();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handleBuyCategory = async (categoryId: string) => {
    setPurchasingId(categoryId);
    const ok = await unlockCategory(categoryId);
    setPurchasingId(null);
    if (ok) {
      setPurchaseCompleted({ returnToGame: false });
    } else {
      setPurchaseFailed(true);
    }
  };

  const handleBuyPremiumQuestions = async (categoryId: string) => {
    setPurchasingId(`premium-questions-${categoryId}`);
    const ok = await unlockPremiumQuestionsForCategory(categoryId);
    setPurchasingId(null);
    if (ok) {
      setPurchaseCompleted({
        returnToGame: shouldReturnToGame && categoryId === paramCategoryId,
      });
    } else {
      setPurchaseFailed(true);
    }
  };

  useEffect(() => {
    if (
      fromOutOfQuestions === "true" &&
      extraQuestionsSectionY !== null &&
      scrollRef.current
    ) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: Math.max(0, extraQuestionsSectionY - 20),
          animated: true,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fromOutOfQuestions, extraQuestionsSectionY]);

  useEffect(() => {
    if (purchaseCompleted) {
      const timer = setTimeout(() => {
        const { returnToGame } = purchaseCompleted;
        setPurchaseCompleted(null);
        if (returnToGame) {
          router.back();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [purchaseCompleted]);

  useEffect(() => {
    if (purchaseFailed) {
      const timer = setTimeout(() => {
        setPurchaseFailed(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [purchaseFailed]);

  const handleBuyPremium = async () => {
    setPurchasingId("premium");
    const ok = await unlockPremium();
    setPurchasingId(null);
    if (ok) {
      setPurchaseCompleted({ returnToGame: false });
    } else {
      setPurchaseFailed(true);
    }
  };

  const loading = purchasesLoading || categoriesLoading;

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
        <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.iconCircle}
              hitSlop={8}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={COLORS.textInverse}
              />
            </Pressable>
            <Text style={styles.title}>{t("shop.title")}</Text>
            <LanguageSwitcher />
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + SPACING.x8 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.premiumCard}>
              <View style={styles.premiumHeader}>
                <Ionicons
                  name="diamond"
                  size={28}
                  color={COLORS.primary}
                  style={styles.premiumIcon}
                />
                <Text style={styles.premiumTitle}>{t("shop.premiumTitle")}</Text>
              </View>
              <Text style={styles.premiumDesc}>
                {t("shop.premiumDesc")}
              </Text>
              <Text style={styles.price}>{t("shop.premiumPrice")}</Text>
              {isPro ? (
                <View style={styles.ownedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.ownedText}>{t("shop.owned")}</Text>
                </View>
              ) : (
                <AppButton
                  variant="cta"
                  onPress={handleBuyPremium}
                  disabled={purchasingId !== null}
                  loading={purchasingId === "premium"}
                >
                  {t("shop.buyPremium")}
                </AppButton>
              )}
            </View>

            <Text style={styles.sectionTitle}>{t("shop.premiumCategories")}</Text>
            {premiumCategories.map((category) => {
              const owned = isCategoryUnlocked(category.id);
              return (
                <View key={category.id} style={styles.categoryCard}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryPrice}>{t("shop.categoryPrice")}</Text>
                  {owned ? (
                    <View style={styles.ownedBadge}>
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                      <Text style={styles.ownedTextSmall}>{t("shop.owned")}</Text>
                    </View>
                  ) : (
                    <AppButton
                      variant="pill"
                      size="small"
                      onPress={() => handleBuyCategory(category.id)}
                      disabled={purchasingId !== null}
                      loading={purchasingId === category.id}
                    >
                      {t("shop.buy")}
                    </AppButton>
                  )}
                </View>
              );
            })}

            {freeCategoriesWithPremiumQuestions.length > 0 && (
              <>
                <View
                  onLayout={(e) =>
                    setExtraQuestionsSectionY(e.nativeEvent.layout.y)
                  }
                  style={styles.extraQuestionsSection}
                >
                <Text style={styles.sectionTitle}>
                  {t("shop.premiumQuestionsSection")}
                </Text>
                <Text style={styles.premiumQuestionsDesc}>
                  {t("shop.premiumQuestionsDesc")}
                </Text>
                {freeCategoriesWithPremiumQuestions.map((category) => {
                  const owned = isPremiumQuestionsUnlocked(category.id);
                  const purchaseKey = `premium-questions-${category.id}`;
                  const shouldBlink =
                    shouldReturnToGame &&
                    paramCategoryId === category.id &&
                    !owned;
                  return (
                    <BlinkingBuyButton
                      key={category.id}
                      shouldBlink={shouldBlink}
                      owned={owned}
                      onPress={() => handleBuyPremiumQuestions(category.id)}
                      disabled={purchasingId !== null}
                      loading={purchasingId === purchaseKey}
                      price={t("shop.premiumQuestionsPrice")}
                      categoryName={category.name}
                      packageLabel={t("shop.premiumQuestionsPackage")}
                      buyLabel={t("shop.buy")}
                      ownedLabel={t("shop.owned")}
                    />
                  );
                })}
                </View>
              </>
            )}

            <Pressable
              onPress={resetPurchases}
              style={styles.resetButton}
              hitSlop={8}
            >
              <Text style={styles.resetText}>{t("shop.resetPurchases")}</Text>
            </Pressable>
          </ScrollView>

          <Modal
            visible={purchaseCompleted !== null}
            transparent
            animationType="fade"
          >
            <View style={styles.purchaseCompletedOverlay}>
              <View style={styles.purchaseCompletedContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={48}
                  color={COLORS.success}
                />
                <Text style={styles.purchaseCompletedText}>
                  {t("shop.purchaseCompleted")}
                </Text>
              </View>
            </View>
          </Modal>

          <Modal
            visible={purchaseFailed}
            transparent
            animationType="fade"
          >
            <View style={styles.purchaseCompletedOverlay}>
              <View style={styles.purchaseCompletedContent}>
                <Ionicons
                  name="close-circle"
                  size={48}
                  color={COLORS.error}
                />
                <Text style={styles.purchaseCompletedText}>
                  {t("shop.purchaseFailed")}
                </Text>
              </View>
            </View>
          </Modal>
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
    paddingHorizontal: SPACING.x4,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.x1,
  },
  title: {
    ...TYPOGRAPHY_BASE.h2,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    flex: 1,
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
  iconCirclePlaceholder: {
    width: 36,
    height: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.x4,
    gap: SPACING.x4,
  },
  premiumCard: {
    backgroundColor: "rgba(34, 10, 64, 0.58)",
    borderRadius: BORDER_RADIUS.x5,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    padding: SPACING.x5,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.x2,
  },
  premiumIcon: {
    marginRight: SPACING.x2,
  },
  premiumTitle: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  premiumDesc: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.x3,
  },
  price: {
    ...TYPOGRAPHY_BASE.h3,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: SPACING.x3,
  },
  sectionTitle: {
    ...TYPOGRAPHY_BASE.h3,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: SPACING.x2,
  },
  premiumQuestionsDesc: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.x2,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 10, 64, 0.4)",
    borderRadius: BORDER_RADIUS.x4,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.x4,
  },
  categoryName: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    fontWeight: "600",
    flex: 1,
  },
  premiumQuestionsCardContent: {
    flex: 1,
  },
  premiumQuestionsCategoryName: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  premiumQuestionsPackage: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.x1,
  },
  categoryPrice: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.primary,
    fontWeight: "600",
    marginRight: SPACING.x3,
  },
  ownedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.x1,
  },
  ownedText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.success,
    fontWeight: "600",
  },
  ownedTextSmall: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.success,
    fontWeight: "600",
  },
  resetButton: {
    alignSelf: "center",
    paddingVertical: SPACING.x2,
    paddingHorizontal: SPACING.x3,
    marginTop: SPACING.x4,
  },
  resetText: {
    ...TYPOGRAPHY_BASE.xSmall,
    color: COLORS.textDisabled,
  },
  extraQuestionsSection: {
    gap: SPACING.x4,
  },
  purchaseCompletedOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.x6,
  },
  purchaseCompletedContent: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.x6,
    padding: SPACING.x8,
    alignItems: "center",
    gap: SPACING.x4,
    minWidth: 260,
  },
  purchaseCompletedText: {
    ...TYPOGRAPHY_BASE.h3,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
});
