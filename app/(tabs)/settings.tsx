import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Settings</ThemedText>
    </View>
  );
}
