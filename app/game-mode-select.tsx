/**
 * Game mode select screen: choose between local game, join game, or create game.
 * Shown after How to Play. Local game uses existing add-players flow.
 */
import { router } from "expo-router";
import {
  ImageBackground,
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

export default function GameModeSelectScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("@/assets/images/purple_galaxy.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerSpacer} />
              <LanguageSwitcher />
            </View>
            <View style={styles.headerBottomRow}>
              <View style={styles.headerSpacer} />
              <View style={styles.titleBlock}>
                <Text style={styles.headerTitle}>
                  {t("gameModeSelect.title")}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {t("gameModeSelect.subtitle")}
                </Text>
              </View>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              {
                paddingBottom: insets.bottom + SPACING.x10,
                paddingTop: SPACING.x6,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.buttonGroup}>
              <View style={styles.optionCard}>
                <AppButton
                  variant="cta"
                  onPress={() => router.replace("/add-players")}
                >
                  {t("gameModeSelect.localGame")}
                </AppButton>
                <Text style={styles.buttonDesc}>
                  {t("gameModeSelect.localGameDesc")}
                </Text>
              </View>

              <View style={styles.optionCard}>
                <AppButton
                  variant="ctaPurple"
                  onPress={() => router.push("/join-game")}
                >
                  {t("gameModeSelect.joinGame")}
                </AppButton>
                <Text style={styles.buttonDesc}>
                  {t("gameModeSelect.joinGameDesc")}
                </Text>
              </View>

              <View style={styles.optionCard}>
                <AppButton
                  variant="ctaBlue"
                  onPress={() => router.push("/create-game")}
                >
                  {t("gameModeSelect.createGame")}
                </AppButton>
                <Text style={styles.buttonDesc}>
                  {t("gameModeSelect.createGameDesc")}
                </Text>
              </View>
            </View>
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
  header: {
    marginBottom: SPACING.x4,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: SPACING.x4,
    paddingBottom: SPACING.x4,
  },
  headerBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.x4,
    paddingBottom: SPACING.x2,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSubtitle: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.x1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.x6,
  },
  titleBlock: {
    flex: 1,
    alignItems: "center",
  },
  buttonGroup: {
    gap: SPACING.x5,
    maxWidth: 380,
    alignSelf: "center",
    width: "100%",
  },
  optionCard: {
    gap: SPACING.x2,
    paddingVertical: SPACING.x2,
    paddingHorizontal: SPACING.x1,
    backgroundColor: "rgba(34, 10, 64, 0.25)",
    borderRadius: BORDER_RADIUS.x6,
    borderWidth: 1,
    borderColor: "rgba(184, 130, 255, 0.15)",
  },
  buttonDesc: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: SPACING.x3,
    lineHeight: 20,
  },
});
