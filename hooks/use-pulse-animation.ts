/**
 * Pulse animation hook for React Native Animated.
 * Runs a loop when active resets to 0 when inactive.
 */
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type UsePulseAnimationOptions = {
  opacityRange?: [number, number];
  scaleRange?: [number, number];
  duration?: number;
};

export function usePulseAnimation(
  active: boolean,
  options: UsePulseAnimationOptions = {}
) {
  const {
    opacityRange = [0.7, 1],
    scaleRange = [1, 1.05],
    duration = 900,
  } = options;

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;

    if (active) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      pulse.setValue(0);
    }

    return () => {
      if (loop) loop.stop();
    };
  }, [active, duration, pulse]);

  const animatedStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: opacityRange,
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: scaleRange,
        }),
      },
    ],
  };

  return animatedStyle;
}
