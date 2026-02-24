import { COLORS } from '@/constants/theme/colors';
import { BORDER_RADIUS } from '@/constants/theme/primitives';
import { SPACING } from '@/constants/theme/spacing';
import { TYPOGRAPHY_BASE } from '@/constants/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HowToPlayScreen() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulse]);

  const hintAnimatedStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.45, 1],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1.02],
        }),
      },
    ],
  };

  return (
    <ImageBackground
      source={require('@/assets/images/instruction_pic.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <Pressable style={styles.overlay} onPress={() => router.replace('/add-players')}>
        <View style={styles.content}>
          <Text style={styles.title}>How to Play</Text>

          <Text style={styles.instructions}>
            Sit in a circle. {'\n'}
            Add players in the next step and choose one category. {'\n'}
            
          </Text>

          <View style={styles.spacer} />

          <Animated.Text style={[styles.hintText, hintAnimatedStyle]}>
            Press the screen to continue.
          </Animated.Text>

          <View style={styles.noteCard}>
            <Ionicons
              name="cart"
              size={16}
              color={COLORS.warning}
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              <Text style={styles.noteLabel}>Note:</Text> Access even more questions{'\n'}
              and categories with in-app purchases!
            </Text>
          </View>
        </View>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.x7,
    paddingTop: 84,
    paddingBottom: SPACING.x8,
  },
  title: {
    ...TYPOGRAPHY_BASE.hero1,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  instructions: {
    ...TYPOGRAPHY_BASE.large,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.x6,
    textShadowColor: 'rgba(0,0,0,0.42)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  spacer: {
    flex: 1,
  },
  hintText: {
    ...TYPOGRAPHY_BASE.small,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginBottom: SPACING.x2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(57, 24, 130, 0.6)',
    borderColor: COLORS.borderSubtle,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.x4,
    paddingHorizontal: SPACING.x4,
    paddingVertical: SPACING.x3,
    marginBottom: SPACING.x2,
  },
  noteIcon: {
    marginTop: 3,
    marginRight: 9,
  },
  noteText: {
    ...TYPOGRAPHY_BASE.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  noteLabel: {
    color: COLORS.warningText,
    fontWeight: '700',
  },
});
