/**
 * Add players screen: manage player names and avatars before starting a game.
 * Uses usePlayerSetup for local state; on "Select category" saves players to
 * game-session and navigates to categories.
 */
import { AVATARS } from "@/constants/avatars";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { usePlayerSetup } from "@/hooks/use-player-setup";
import { useResetWhen } from "@/hooks/use-avatar-page-reset";
import { getGamePlayers, setGamePlayers } from "@/services/game-session";
import { MIN_PLAYERS } from "@/types/player";

const AVATARS_PER_ROW = 3;
const AVATAR_ROWS_PER_PAGE = 3;
const AVATARS_PER_PAGE = AVATARS_PER_ROW * AVATAR_ROWS_PER_PAGE;
const AVATAR_OPTION_SIZE = 68;

// Single avatar button in a player row; shows placeholder (+) if no avatar selected
function AvatarPickerButton({
  avatarId,
  onPress,
}: {
  avatarId: number;
  onPress: () => void;
}) {
  const isPlaceholder = avatarId < 0;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.avatarPicker,
        pressed && styles.avatarPickerPressed,
      ]}
      hitSlop={8}
    >
      {isPlaceholder ? (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="add" size={28} color={COLORS.textSecondary} />
        </View>
      ) : (
        <Image
          source={AVATARS[avatarId % AVATARS.length]}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      )}
    </Pressable>
  );
}

// Modal to pick an avatar from the AVATARS list; supports pagination when many avatars
function AvatarPickerModal({
  visible,
  selectedId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(AVATARS.length / AVATARS_PER_PAGE));
  const hasMultiplePages = totalPages > 1;

  useResetWhen(visible, 0, setPage);

  const visibleAvatars = useMemo(() => {
    const start = page * AVATARS_PER_PAGE;
    return AVATARS.slice(start, start + AVATARS_PER_PAGE);
  }, [page]);

  const handleNextPage = () => {
    if (!hasMultiplePages) return;
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handlePreviousPage = () => {
    if (!hasMultiplePages) return;
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.modalTitle}>Select avatar</Text>
          <View style={styles.avatarGrid}>
            {visibleAvatars.map((avatarSource, index) => {
              const id = page * AVATARS_PER_PAGE + index;
              return (
                <Pressable
                  key={id}
                  onPress={() => {
                    onSelect(id);
                  }}
                  style={[
                    styles.avatarOption,
                    selectedId === id && styles.avatarOptionSelected,
                  ]}
                >
                  <Image
                    source={avatarSource}
                    style={styles.avatarOptionImage}
                    resizeMode="cover"
                  />
                </Pressable>
              );
            })}
          </View>
          {hasMultiplePages ? (
            <View style={styles.paginationRow}>
              <Pressable
                onPress={handlePreviousPage}
                style={({ pressed }) => [
                  styles.pageNavButton,
                  pressed && styles.pageNavButtonPressed,
                ]}
                hitSlop={8}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={COLORS.textPrimary}
                />
              </Pressable>
              <Text style={styles.pageIndicator}>
                {page + 1}/{totalPages}
              </Text>
              <Pressable
                onPress={handleNextPage}
                style={({ pressed }) => [
                  styles.pageNavButton,
                  pressed && styles.pageNavButtonPressed,
                ]}
                hitSlop={8}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textPrimary}
                />
              </Pressable>
            </View>
          ) : null}
        </View>
      </Pressable>
    </Modal>
  );
}

// One row per player: avatar picker, name input, and optional remove button
function PlayerInputRow({
  name,
  avatarId,
  onNameChange,
  onAvatarPress,
  onRemove,
  canRemove,
}: {
  name: string;
  avatarId: number;
  onNameChange: (text: string) => void;
  onAvatarPress: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <View style={styles.playerRow}>
      <AvatarPickerButton avatarId={avatarId} onPress={onAvatarPress} />
      <TextInput
        style={styles.playerInput}
        value={name}
        onChangeText={onNameChange}
        placeholder="Name"
        placeholderTextColor={COLORS.textDisabled}
      />
      {canRemove && (
        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removeButtonPressed,
          ]}
          hitSlop={12}
        >
          <Ionicons name="close" size={20} color="#FFF" />
        </Pressable>
      )}
    </View>
  );
}

export default function AddPlayersScreen() {
  const { addMore } = useLocalSearchParams<{ addMore?: string }>();
  const isAddMoreMode = addMore === "true";

  const {
    players,
    addPlayer,
    updatePlayerName,
    removePlayer,
    avatarPickerPlayerId,
    selectedAvatarId,
    openAvatarPicker,
    closeAvatarPicker,
    selectAvatarForActivePlayer,
    canStart,
  } = usePlayerSetup(isAddMoreMode ? getGamePlayers() : null);

  const handleStartGame = () => {
    if (canStart) {
      setGamePlayers(players);
      if (isAddMoreMode) {
        router.replace("/game");
      } else {
        router.replace("/categories");
      }
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/purple_galaxy.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.headerRow}>
          {isAddMoreMode ? (
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
          ) : (
            <View style={styles.headerSpacer} />
          )}
          <Text style={styles.headerTitle}>
            {isAddMoreMode ? "Add More Players" : "Add Players"}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Enter a name and pick an avatar to continue.
          </Text>

          <ScrollView
            style={styles.playersScrollView}
            contentContainerStyle={styles.playersScrollContent}
            showsVerticalScrollIndicator={players.length > 5}
            keyboardShouldPersistTaps="handled"
          >
            {players.map((player) => (
              <PlayerInputRow
                key={player.id}
                name={player.name}
                avatarId={player.avatarId}
                onNameChange={(text) => updatePlayerName(player.id, text)}
                onAvatarPress={() => openAvatarPicker(player.id)}
                onRemove={() => removePlayer(player.id)}
                canRemove={players.length > MIN_PLAYERS}
              />
            ))}
          </ScrollView>

          <View style={styles.footerSection}>
            <View style={styles.addPlayerSection}>
              <AppButton variant="fab" onPress={addPlayer}>
                <Ionicons name="add" size={34} color="#FFF" />
              </AppButton>
              <Text style={styles.addPlayerLabel}>Add Player</Text>
            </View>
            <AppButton
              variant="cta"
              onPress={handleStartGame}
              disabled={!canStart}
            >
              {isAddMoreMode ? "Back to game" : "Select category"}
            </AppButton>
          </View>
        </View>
      </KeyboardAvoidingView>

      {avatarPickerPlayerId !== null && (
        <AvatarPickerModal
          visible={true}
          selectedId={selectedAvatarId}
          onSelect={selectAvatarForActivePlayer}
          onClose={closeAvatarPicker}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.x4,
    paddingTop: 56,
    paddingBottom: SPACING.x2,
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
  headerSpacer: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.x8,
    paddingTop: SPACING.x2,
    paddingBottom: SPACING.x10,
  },
  subtitle: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.x5,
  },
  playersScrollView: {
    flex: 1,
    minHeight: 0,
  },
  playersScrollContent: {
    gap: SPACING.x3,
    paddingBottom: SPACING.x4,
  },
  footerSection: {
    paddingTop: SPACING.x4,
    gap: SPACING.x4,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.x3,
    backgroundColor: "rgba(138, 74, 255, 0.34)",
    borderWidth: 1.2,
    borderColor: "rgba(220, 181, 255, 0.8)",
    borderRadius: BORDER_RADIUS.x6,
    paddingHorizontal: SPACING.x4,
    paddingVertical: SPACING.x3,
  },
  avatarPicker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1.2,
    borderColor: "rgba(220, 181, 255, 0.8)",
    backgroundColor: "rgba(138, 74, 255, 0.4)",
  },
  avatarPickerPressed: {
    opacity: 0.85,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(138, 74, 255, 0.25)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  playerInput: {
    flex: 1,
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.x2,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  removeButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  addPlayerSection: {
    alignItems: "center",
    gap: SPACING.x2,
  },
  addPlayerLabel: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.x6,
  },
  modalContent: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.x6,
    padding: SPACING.x6,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.x4,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: SPACING.x3,
    minHeight:
      AVATAR_ROWS_PER_PAGE * AVATAR_OPTION_SIZE +
      (AVATAR_ROWS_PER_PAGE - 1) * SPACING.x3,
  },
  avatarOption: {
    width: AVATAR_OPTION_SIZE,
    height: AVATAR_OPTION_SIZE,
    borderRadius: AVATAR_OPTION_SIZE / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarOptionSelected: {
    borderColor: COLORS.secondary,
  },
  avatarOptionImage: {
    width: "100%",
    height: "100%",
  },
  paginationRow: {
    marginTop: SPACING.x3,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: SPACING.x2,
  },
  pageIndicator: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textSecondary,
  },
  pageNavButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  pageNavButtonPressed: {
    opacity: 0.8,
  },
});
