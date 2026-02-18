import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/AppButton';
import { MenuBubbleButton } from '@/components/ui/MenuBubbleButton';
import React from 'react';

export default function HomeScreen() {
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
            <View style={styles.bubbleGrid}>
              <MenuBubbleButton
                label="Love & Relationships"
                size="large"
                active
                emoji="💜"
              />
              <MenuBubbleButton
                label="Funny"
                size="large"
                active
                emoji="🤪"
              />
              <MenuBubbleButton
                label="Chaos"
                size="large"
                active
                emoji="😈"
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
  bubbleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    columnGap: 8,
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
