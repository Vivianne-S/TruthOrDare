import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_BY_ROUTE: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  categories: 'folder-open-outline',
  players: 'people-outline',
  settings: 'settings-outline',
  shop: 'cart-outline',
};

const ROUTE_GRADIENT: Record<string, readonly [string, string]> = {
  index: ['#FF4FD8', '#FF9AF0'],
  categories: ['#FF4FD8', '#FF9AF0'],
  players: ['#FF8A4D', '#FF5FCF'],
  settings: ['#FF4FD8', '#FF9AF0'],
  shop: ['#FF4FD8', '#FF8A4D'],
};

function GradientIcon({
  name,
  size,
  active,
  routeName,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  active: boolean;
  routeName: string;
}) {
  const activeColors = ROUTE_GRADIENT[routeName] ?? ['#FF4FD8', '#FF9AF0'];
  const inactiveColors = ['#A388D9', '#C8B7E8'] as const;

  return (
    <MaskedView maskElement={<Ionicons name={name} size={size} color="#000" />}>
      <LinearGradient
        colors={active ? inactiveColors : activeColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: size, height: size }}
      />
    </MaskedView>
  );
}

export function GradientTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = state.routes;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(10, insets.bottom) }]}>
      <LinearGradient
        colors={['rgba(110, 205, 255, 0.72)', 'rgba(255, 90, 230, 0.9)', 'rgba(141, 79, 255, 0.85)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.frame}>
        <LinearGradient
          colors={['rgba(85, 37, 156, 0.62)', 'rgba(64, 27, 138, 0.72)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}>
          <View pointerEvents="none" style={styles.neonBorder} />
          {visibleRoutes.map((route) => {
            const index = state.routes.findIndex((r) => r.key === route.key);
            const isFocused = state.index === index;
            const iconName = ICON_BY_ROUTE[route.name] ?? 'ellipse-outline';

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            const accessibilityLabel = descriptors[route.key].options.tabBarAccessibilityLabel;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={accessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.item}>
                <GradientIcon
                  name={iconName}
                  size={36}
                  active={isFocused}
                  routeName={route.name}
                />
              </Pressable>
            );
          })}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  frame: {
    borderRadius: 34,
    padding: 1.35,
    shadowColor: '#FF67E7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 13,
  },
  container: {
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  neonBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(170, 216, 255, 0.35)',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
});
