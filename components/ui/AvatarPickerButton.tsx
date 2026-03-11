/**
 * Button to show selected avatar or placeholder (+); opens avatar picker on press.
 */
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { AVATARS } from "@/constants/avatars";
import { COLORS } from "@/constants/theme/colors";

type AvatarPickerButtonProps = {
  avatarId: number;
  onPress: () => void;
};

export function AvatarPickerButton({ avatarId, onPress }: AvatarPickerButtonProps) {
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

const styles = StyleSheet.create({
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
});
