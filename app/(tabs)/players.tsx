import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function PlayersScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Players</ThemedText>
    </View>
  );
}
