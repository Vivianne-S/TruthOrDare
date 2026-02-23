import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { GradientTabBar } from '@/components/ui/GradientTabBar';
import { COLORS } from '@/constants/theme/colors';

export default function TabLayout() {
  return (
    <ImageBackground
      source={require('@/assets/images/purple_galaxy.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Tabs
          screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: 'transparent' },
          }}
          tabBar={(props) => <GradientTabBar {...props} />}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Hem',
            }}
          />
          <Tabs.Screen
            name="categories"
            options={{
              title: 'Kategorier',
            }}
          />
          <Tabs.Screen
            name="players"
            options={{
              title: 'Spelare',
            }}
          />
          <Tabs.Screen
            name="shop"
            options={{
              title: 'Shop',
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Anpassa',
            }}
          />
        </Tabs>
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
    backgroundColor: COLORS.overlayPressed,
  },
});
