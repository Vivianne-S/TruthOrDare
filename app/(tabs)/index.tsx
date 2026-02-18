import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/AppButton';
import React from 'react';
import { CategoryBubbleButton } from '@/components/ui/CategoryBubbleButton';
import { BubbleSlot } from '@/constants/category-bubbles';

export default function HomeScreen() {
  const [activePreviewBubble, setActivePreviewBubble] = React.useState<string | null>(null);
  const touchX = useSharedValue(-1000);
  const touchY = useSharedValue(-1000);
  const touching = useSharedValue(0);
  const bubblePreviewSlots: BubbleSlot[] = [
    { x: 0.02, y: 0.08, size: 112 },
    { x: 0.36, y: 0.24, size: 118 },
    { x: 0.72, y: 0.08, size: 108 },
  ];

  return (
    <ImageBackground
      source={require('@/assets/images/purple_galaxy.png')}
      resizeMode="cover"
      style={styles.background}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleContainer}>
            <ThemedText type="title">Truth or Dare!</ThemedText>
          </View>

          <View style={styles.buttonsContainer}>
            <ThemedText type="subtitle">Add Players</ThemedText>

            <AppButton variant="chip" rightIcon={<Ionicons name="close" size={20} color="#FFF" />}>
              Emma
            </AppButton>

            {/* <AppButton variant="chip" rightIcon={<Ionicons name="close" size={20} color="#FFF" />}>
              Jacob
            </AppButton> */}

            <AppButton variant="fab">
              <Ionicons name="add" size={34} color="#FFF" />
            </AppButton>

            <ThemedText style={styles.centerLabel}>Add Player</ThemedText>

            <AppButton variant="cta">Start Game</AppButton>

            <View style={styles.choiceRow}>
              <AppButton variant="truth">TRUTH</AppButton>
              <AppButton variant="dare">DARE</AppButton>
            </View>

            <ThemedText type="subtitle">Select a Category</ThemedText>
            <View
              style={styles.bubblePreviewField}
              onTouchStart={(event) => {
                touching.value = 1;
                touchX.value = event.nativeEvent.locationX;
                touchY.value = event.nativeEvent.locationY;
              }}
              onTouchMove={(event) => {
                touchX.value = event.nativeEvent.locationX;
                touchY.value = event.nativeEvent.locationY;
              }}
              onTouchEnd={() => {
                touching.value = 0;
                touchX.value = -1000;
                touchY.value = -1000;
              }}
              onTouchCancel={() => {
                touching.value = 0;
                touchX.value = -1000;
                touchY.value = -1000;
              }}>
              <CategoryBubbleButton
                name="Love and Relationships"
                slot={bubblePreviewSlots[0]}
                isOpen={activePreviewBubble === 'love'}
                onPress={() => setActivePreviewBubble('love')}
                fieldWidth={300}
                fieldHeight={200}
                touchX={touchX}
                touchY={touchY}
                touching={touching}
              />
              <CategoryBubbleButton
                name="Funny"
                slot={bubblePreviewSlots[1]}
                isOpen={activePreviewBubble === 'funny'}
                onPress={() => setActivePreviewBubble('funny')}
                fieldWidth={300}
                fieldHeight={200}
                touchX={touchX}
                touchY={touchY}
                touching={touching}
              />
              <CategoryBubbleButton
                name="Chaos"
                slot={bubblePreviewSlots[2]}
                isOpen={activePreviewBubble === 'chaos'}
                onPress={() => setActivePreviewBubble('chaos')}
                fieldWidth={300}
                fieldHeight={200}
                touchX={touchX}
                touchY={touchY}
                touching={touching}
              />
            </View>

            <View style={styles.bottomRow}>
              <AppButton variant="pill" size="small" style={styles.bottomButton}>
                Next
              </AppButton>
              <AppButton variant="pill" size="small" style={styles.bottomButton}>
                Pass
              </AppButton>
            </View>

            <AppButton variant="arrowNeon" style={styles.arrowButton}>
              <Ionicons name="arrow-forward" size={36} color="#FFF" />
            </AppButton>
          </View>
        </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    padding: 32,
    paddingTop: 72,
    paddingBottom: 160,
    gap: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonsContainer: {
    gap: 14,
  },
  choiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  bubblePreviewField: {
    position: 'relative',
    height: 230,
    width: 300,
    alignSelf: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  bottomButton: {
    flex: 1,
    alignSelf: 'auto',
  },
  centerLabel: {
    textAlign: 'center',
    color: '#ECDDFF',
  },
  arrowButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
});
