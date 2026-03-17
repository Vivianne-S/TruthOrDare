/**
 * Modal to pick an avatar from the AVATARS list; supports pagination.
 */
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { AVATARS } from "@/constants/avatars";
import { COLORS } from "@/constants/theme/colors";
import { BORDER_RADIUS } from "@/constants/theme/primitives";
import { SPACING } from "@/constants/theme/spacing";
import { TYPOGRAPHY_BASE } from "@/constants/theme/typography";
import { useI18n } from "@/context/I18nContext";
import { useResetWhen } from "@/hooks/use-avatar-page-reset";

const AVATARS_PER_ROW = 3;
const AVATAR_ROWS_PER_PAGE = 3;
const AVATARS_PER_PAGE = AVATARS_PER_ROW * AVATAR_ROWS_PER_PAGE;
const AVATAR_OPTION_SIZE = 68;

type AvatarPickerModalProps = {
  visible: boolean;
  selectedId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
};

export function AvatarPickerModal({
  visible,
  selectedId,
  onSelect,
  onClose,
}: AvatarPickerModalProps) {
  const { t } = useI18n();
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
          <Text style={styles.modalTitle}>{t("addPlayers.selectAvatar")}</Text>
          <View style={styles.avatarGrid}>
            {visibleAvatars.map((avatarSource, index) => {
              const id = page * AVATARS_PER_PAGE + index;
              return (
                <Pressable
                  key={id}
                  onPress={() => onSelect(id)}
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

const styles = StyleSheet.create({
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
