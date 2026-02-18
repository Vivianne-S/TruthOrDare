import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme/colors';
import { BORDER_RADIUS } from '@/constants/theme/primitives';
import { SPACING } from '@/constants/theme/spacing';
import { TYPOGRAPHY_BASE } from '@/constants/theme/typography';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/AppButton';

const DEFAULT_PLAYERS = ['Emma', 'Jacob'];

function PlayerAvatar({ name }: { name: string }) {
  const initial = name.trim() ? name[0].toUpperCase() : '?';
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initial}</Text>
    </View>
  );
}

function PlayerInputRow({
  value,
  onChangeText,
  onRemove,
  canRemove,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <View style={styles.playerRow}>
      <TextInput
        style={styles.playerInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Spelarnamn"
        placeholderTextColor={COLORS.textDisabled}
      />
      {canRemove && (
        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
          hitSlop={12}>
          <Ionicons name="close" size={20} color="#FFF" />
        </Pressable>
      )}
    </View>
  );
}

export default function AddPlayersScreen() {
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);

  const updatePlayer = (index: number, name: string) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const removePlayer = (index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const addPlayer = () => {
    setPlayers((prev) => [...prev, '']);
  };

  const handleStartGame = () => {
    const validPlayers = players.filter((p) => p.trim().length > 0);
    if (validPlayers.length >= 2) {
      router.replace('/(tabs)');
    }
  };

  const validCount = players.filter((p) => p.trim().length > 0).length;
  const canStart = validCount >= 2;

  return (
    <ImageBackground
      source={require('@/assets/images/purple_galaxy.png')}
      resizeMode="cover"
      style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add Players</Text>

          <View style={styles.avatarsRow}>
            {players.slice(0, 4).map((name, i) => (
              <View key={i} style={styles.avatarWrapper}>
                <PlayerAvatar name={name} />
                <Text style={styles.avatarName} numberOfLines={1}>
                  {name || '...'}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.inputsContainer}>
            {players.map((name, index) => (
              <PlayerInputRow
                key={index}
                value={name}
                onChangeText={(text) => updatePlayer(index, text)}
                onRemove={() => removePlayer(index)}
                canRemove={players.length > 2}
              />
            ))}
          </View>

          <View style={styles.addPlayerSection}>
            <AppButton variant="fab" onPress={addPlayer}>
              <Ionicons name="add" size={34} color="#FFF" />
            </AppButton>
            <Text style={styles.addPlayerLabel}>Add Player</Text>
          </View>

          <View style={styles.spacer} />

          <AppButton variant="cta" onPress={handleStartGame} disabled={!canStart}>
            Start Game
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.x8,
    paddingTop: 72,
    paddingBottom: SPACING.x10,
  },
  title: {
    ...TYPOGRAPHY_BASE.hero1,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.x8,
  },
  avatarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.x5,
    marginBottom: SPACING.x6,
  },
  avatarWrapper: {
    alignItems: 'center',
    width: 72,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(138, 74, 255, 0.4)',
    borderWidth: 1.2,
    borderColor: 'rgba(220, 181, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY_BASE.h2,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  avatarName: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textPrimary,
    marginTop: SPACING.x1,
    textAlign: 'center',
    maxWidth: '100%',
  },
  inputsContainer: {
    gap: SPACING.x3,
    marginBottom: SPACING.x6,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 74, 255, 0.34)',
    borderWidth: 1.2,
    borderColor: 'rgba(220, 181, 255, 0.8)',
    borderRadius: BORDER_RADIUS.x6,
    paddingHorizontal: SPACING.x4,
    paddingVertical: SPACING.x3,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  removeButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  addPlayerSection: {
    alignItems: 'center',
    gap: SPACING.x2,
    marginBottom: SPACING.x4,
  },
  addPlayerLabel: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.x4,
  },
});
