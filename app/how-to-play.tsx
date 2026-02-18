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
      <Pressable style={styles.overlay} onPress={() => router.replace('/(tabs)')}>
        <View style={styles.content}>
          <Text style={styles.title}>How to Play</Text>

          <Text style={styles.instructions}>
            Sit in a circle. {'\n'}
            Add players on the next step and choose one category. {'\n'}
            The player who started the game goes first. Continue taking turns clockwise.
          </Text>

          <View style={styles.spacer} />

          <Animated.Text style={[styles.hintText, hintAnimatedStyle]}>
            Press the screen to continue.
          </Animated.Text>

          <View style={styles.noteCard}>
            <Ionicons name="cart" size={16} color="#FFD85E" style={styles.noteIcon} />
            <Text style={styles.noteText}>
              <Text style={styles.noteLabel}>Note:</Text> access even more questions{'\n'}
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
    backgroundColor: '#12052B',
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 84,
    paddingBottom: 34,
  },
  title: {
    fontSize: 46,
    lineHeight: 52,
    color: '#F2E8FF',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  instructions: {
    color: '#E8DAFF',
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 26,
    textShadowColor: 'rgba(0,0,0,0.42)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  spacer: {
    flex: 1,
  },
  hintText: {
    color: '#CDB7F3',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(57, 24, 130, 0.6)',
    borderColor: 'rgba(171, 132, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  noteIcon: {
    marginTop: 3,
    marginRight: 9,
  },
  noteText: {
    color: '#D7C1FF',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
    flex: 1,
  },
  noteLabel: {
    color: '#FFE07B',
    fontWeight: '700',
  },
});
