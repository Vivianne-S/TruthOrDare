import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BubbleSlot, getCategoryEmoji } from '@/constants/category-bubbles';
import { COLORS } from '@/constants/theme/colors';
import { TYPOGRAPHY_BASE } from '@/constants/theme/typography';

const FLOAT_Y_AMPLITUDE = 8;
const FLOAT_X_AMPLITUDE = 3;

type CategoryBubbleButtonProps = {
  name: string;
  icon?: string | null;
  slot: BubbleSlot;
  isOpen: boolean;
  isLocked?: boolean;
  onPress: () => void;
  fieldWidth: number;
  fieldHeight: number;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
  touching: SharedValue<number>;
};

export function CategoryBubbleButton({
  name,
  icon,
  slot,
  isOpen,
  isLocked = false,
  onPress,
  fieldWidth,
  fieldHeight,
  touchX,
  touchY,
  touching,
}: CategoryBubbleButtonProps) {
  const diameter = slot.size;
  const isLongLabel = name.length > 10;
  const isVeryLongLabel = name.length > 15;
  const baseX = Math.max(0, Math.min(fieldWidth - diameter, slot.x * fieldWidth));
  const baseY = Math.max(0, Math.min(fieldHeight - diameter, slot.y * fieldHeight));
  const selectedProgress = useSharedValue(isOpen ? 1 : 0);
  const floatYProgress = useSharedValue(Math.random());
  const floatXProgress = useSharedValue(Math.random());
  const pulseProgress = useSharedValue(Math.random());

  useEffect(() => {
    selectedProgress.value = withTiming(isOpen ? 1 : 0, { duration: 220 });
  }, [isOpen, selectedProgress]);

  useEffect(() => {
    const yDuration = 2200 + Math.floor(Math.random() * 900);
    const xDuration = 2600 + Math.floor(Math.random() * 1200);
    const pulseDuration = 2000 + Math.floor(Math.random() * 1000);
    floatYProgress.value = withRepeat(withTiming(1, { duration: yDuration }), -1, true);
    floatXProgress.value = withRepeat(withTiming(1, { duration: xDuration }), -1, true);
    pulseProgress.value = withRepeat(withTiming(1, { duration: pulseDuration }), -1, true);
  }, [floatXProgress, floatYProgress, pulseProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const floatY = interpolate(floatYProgress.value, [0, 1], [-FLOAT_Y_AMPLITUDE, FLOAT_Y_AMPLITUDE]);
    const floatX = interpolate(floatXProgress.value, [0, 1], [-FLOAT_X_AMPLITUDE, FLOAT_X_AMPLITUDE]);

    const selectedBoost = selectedProgress.value;
    const pulseScale = interpolate(pulseProgress.value, [0, 1], [0.985, 1.02]);
    const scale = (1 + selectedBoost * 0.28) * pulseScale;
    const glowOpacity = 0.2 + selectedBoost * 0.55;

    return {
      left: baseX + floatX,
      top: baseY + floatY,
      transform: [{ scale }],
      shadowOpacity: glowOpacity,
      borderWidth: 1.05 + selectedBoost * 0.35,
      borderColor:
        selectedBoost > 0.02
          ? 'rgba(255, 146, 244, 0.98)'
          : 'rgba(196, 146, 255, 0.28)',
    };
  }, [baseX, baseY, diameter]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        isLocked && styles.bubbleLocked,
        isOpen && styles.bubbleOpen,
        animatedStyle,
        {
          width: diameter,
          height: diameter,
        },
      ]}
    >
      {isOpen && <View pointerEvents="none" style={styles.openHalo} />}
      {isLocked && (
        <View pointerEvents="none" style={styles.lockBadge}>
          <Text style={styles.lockBadgeText}>🔒</Text>
        </View>
      )}
      <Pressable style={styles.bubbleTouch} onPress={onPress}>
        <Text style={styles.emoji}>{icon?.trim() ? icon : getCategoryEmoji(name)}</Text>
        <Text
          numberOfLines={isVeryLongLabel ? 3 : 2}
          style={[
            styles.bubbleLabel,
            isLongLabel && styles.bubbleLabelSmall,
            isVeryLongLabel && styles.bubbleLabelVerySmall,
          ]}>
          {name}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(164, 102, 255, 0.22)',
    borderWidth: 1.25,
    borderColor: COLORS.borderSubtle,
    shadowColor: '#FF76EA',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 10,
  },
  bubbleOpen: {
    zIndex: 30,
    shadowColor: '#7CC8FF',
    shadowRadius: 26,
    elevation: 16,
  },
  bubbleLocked: {
    backgroundColor: 'rgba(115, 92, 150, 0.24)',
    borderColor: COLORS.warningBorder,
  },
  openHalo: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 1.1,
    borderColor: 'rgba(150, 185, 255, 0.95)',
    shadowColor: '#9B7BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  bubbleTouch: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(63, 16, 114, 0.22)',
  },
  lockBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 20,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 8, 28, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255, 230, 155, 0.75)',
  },
  lockBadgeText: {
    fontSize: 11,
  },
  emoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  bubbleLabel: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
  },
  bubbleLabelSmall: {
    fontSize: 13,
    lineHeight: 15,
  },
  bubbleLabelVerySmall: {
    fontSize: 11,
    lineHeight: 13,
  },
});
