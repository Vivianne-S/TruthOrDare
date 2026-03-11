/**
 * Shop screen: purchasable categories ($4.99) and premium all-in-one ($19.99).
 * Demo mode – purchases unlock without real payment.
 */
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/AppButton";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/context/I18nContext";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useDemoPurchases } from "@/hooks/use-demo-purchases";
import { useShopCategories } from "@/hooks/use-shop-categories";

export default function ShopScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const {
    isPro,
    isCategoryUnlocked,
    unlockCategory,
    unlockPremium,
    resetPurchases,
    loading: purchasesLoading,
  } = useDemoPurchases();
  const { premiumCategories, loading: categoriesLoading } = useShopCategories();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handleBuyCategory = async (categoryId: string) => {
    setPurchasingId(categoryId);
    await unlockCategory(categoryId);
    setPurchasingId(null);
  };

  const handleBuyPremium = async () => {
    setPurchasingId("premium");
    await unlockPremium();
    setPurchasingId(null);
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

            <Pressable
              onPress={resetPurchases}
              style={styles.resetButton}
              hitSlop={8}
            >
              <Text style={styles.resetText}>{t("shop.resetPurchases")}</Text>
            </Pressable>
          </ScrollView>
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
    flex: 1,
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
});
