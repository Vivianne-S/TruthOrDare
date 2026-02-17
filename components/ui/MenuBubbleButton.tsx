import { BORDER_RADIUS } from '@/constants/theme/primitives';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type MenuBubbleButtonSize = 'small' | 'large';

interface MenuBubbleButtonProps {
  label: string;
  icon?: ReactNode;
  emoji?: string;
  onPress?: () => void;
  size?: MenuBubbleButtonSize;
  active?: boolean;
}

export function MenuBubbleButton({
  label,
  icon,
  emoji,
  onPress,
  size = 'small',
  active = false,
}: MenuBubbleButtonProps) {
  const isLarge = size === 'large';
  const pulse = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    if (active) {
      pulse.value = withRepeat(
        withTiming(1, {
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.quad) });
    }
  }, [active, pulse]);

  const animatedHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.03 }],
    opacity: active ? 0.28 + pulse.value * 0.24 : 0.16,
  }));
  const animatedRingStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      pulse.value,
      [0, 1],
      ['rgba(255,170,246,0.72)', 'rgba(255,215,251,1)']
    ),
    opacity: active ? 0.84 + pulse.value * 0.16 : 0.55,
  }));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.containerBase,
        isLarge ? styles.large : styles.small,
        active ? styles.activeShadow : styles.idleShadow,
        active ? styles.activeHalo : styles.idleHalo,
        pressed ? styles.pressed : null,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.ringGlow,
          isLarge ? styles.large : styles.small,
          active ? styles.ringGlowActive : styles.ringGlowIdle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.haloPulse,
          isLarge ? styles.large : styles.small,
          active ? styles.activeHalo : styles.idleHalo,
          animatedHaloStyle,
        ]}
      />
      <BlurView
        tint="dark"
        intensity={active ? 46 : 34}
        experimentalBlurMethod="dimezisBlurView"
        style={[
          styles.surfaceBase,
          isLarge ? styles.large : styles.small,
          active ? styles.activeSurface : styles.idleSurface,
        ]}
      >
        <Animated.View
          style={[
            styles.outerRing,
            active ? styles.outerRingActive : styles.outerRingIdle,
            animatedRingStyle,
          ]}
        />
        {active ? (
          <>
            <Animated.View style={[styles.sparkle, styles.sparkleLeft, animatedHaloStyle]} />
            <Animated.View style={[styles.sparkle, styles.sparkleRight, animatedHaloStyle]} />
          </>
        ) : null}
        <LinearGradient
          colors={
            active
              ? ['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']
              : ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']
          }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 0.95 }}
          style={styles.glassLayer}
        />
        {emoji ? <Text style={[styles.emoji, isLarge ? styles.emojiLarge : styles.emojiSmall]}>{emoji}</Text> : null}
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <Text
          numberOfLines={2}
          style={[styles.label, isLarge ? styles.labelLarge : styles.labelSmall]}
        >
          {label}
        </Text>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  containerBase: {
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  surfaceBase: {
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  small: {
    width: 92,
    height: 92,
  },
  large: {
    width: 150,
    height: 150,
  },
  idleSurface: {
    borderWidth: 0.7,
    borderColor: 'rgba(221, 186, 255, 0.24)',
    backgroundColor: 'rgba(112, 52, 190, 0.1)',
  },
  activeSurface: {
    borderWidth: 0.8,
    borderColor: 'rgba(255, 191, 250, 0.32)',
    backgroundColor: 'rgba(128, 58, 212, 0.08)',
  },
  outerRing: {
    ...StyleSheet.absoluteFillObject,
    margin: 1,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 0.6,
  },
  ringGlow: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.round,
  },
  ringGlowIdle: {
    shadowColor: '#A86CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  ringGlowActive: {
    shadowColor: '#FF6EEB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.72,
    shadowRadius: 20,
    elevation: 11,
  },
  outerRingIdle: {
    borderColor: 'rgba(214, 168, 255, 0.42)',
  },
  outerRingActive: {
    borderColor: 'rgba(255, 177, 248, 0.9)',
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: 'rgba(255, 153, 245, 0.95)',
    shadowColor: '#FF7EEA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 6,
    elevation: 7,
  },
  sparkleLeft: {
    left: 2,
    top: '34%',
  },
  sparkleRight: {
    right: 2,
    top: '66%',
  },
  idleShadow: {
    shadowColor: '#9C6EFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  activeShadow: {
    shadowColor: '#F05CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 9,
  },
  haloPulse: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.round,
  },
  idleHalo: {
    shadowColor: '#B386FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 11,
    elevation: 5,
  },
  activeHalo: {
    shadowColor: '#FF65E6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.58,
    shadowRadius: 18,
    elevation: 9,
  },
  glassLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  emoji: {
    textAlign: 'center',
  },
  emojiSmall: {
    fontSize: 18,
    lineHeight: 20,
    marginBottom: 6,
  },
  emojiLarge: {
    fontSize: 26,
    lineHeight: 28,
    marginBottom: 8,
  },
  iconWrap: {
    marginBottom: 6,
  },
  label: {
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  labelSmall: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
  },
  labelLarge: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});
