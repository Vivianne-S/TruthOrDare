/**
 * How-to-play instructions screen.
 * Shows game rules and a note about in-app purchases.
 * Tap anywhere to continue to the game mode select screen.
 */
import { COLORS } from '@/constants/theme/colors';
import { BORDER_RADIUS } from '@/constants/theme/primitives';
import { SPACING } from '@/constants/theme/spacing';
import { TYPOGRAPHY_BASE } from '@/constants/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useI18n } from '@/context/I18nContext';
import { usePulseAnimation } from '@/hooks/use-pulse-animation';

export default function HowToPlayScreen() {
  const { t } = useI18n();
  const hintAnimatedStyle = usePulseAnimation(true, {
    opacityRange: [0.45, 1],
    scaleRange: [0.98, 1.02],
  });

  return (
    <ImageBackground
      source={require('@/assets/images/instruction_pic.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <LanguageSwitcher />
      </View>
      <Pressable style={styles.overlay} onPress={() => router.replace('/game-mode-select')}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('howToPlay.title')}</Text>

          <ScrollView
            style={styles.instructionsScroll}
            contentContainerStyle={styles.instructionsScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.instructions}>
              <Text style={styles.stepLabel}>1.</Text> {t('howToPlay.step1')}{'\n'}
              <Text style={styles.stepLabel}>2.</Text> {t('howToPlay.step2')}{'\n'}
              <Text style={styles.stepLabel}>3.</Text> {t('howToPlay.step3')}{'\n'}
              <Text style={styles.stepLabel}>4.</Text> {t('howToPlay.step4')}
            </Text>
          </ScrollView>
          <View style={styles.spacer} />

          <Animated.Text style={[styles.hintText, hintAnimatedStyle]}>
            {t('howToPlay.hint')}
          </Animated.Text>

          <View style={styles.noteCard}>
            <Ionicons
              name="cart"
              size={16}
              color={COLORS.warning}
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>
              <Text style={styles.noteLabel}>{t('howToPlay.note')}</Text> {t('howToPlay.noteText')}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.x4,
    paddingTop: 56,
    paddingBottom: SPACING.x2,
  },
  topBarSpacer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.x7,
    paddingTop: SPACING.x1,
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
  stepLabel: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  instructionsScroll: {
    maxHeight: Dimensions.get('window').height * 0.32,
    marginTop: SPACING.x2,
  },
  instructionsScrollContent: {
    flexGrow: 1,
  },
  instructions: {
    ...TYPOGRAPHY_BASE.large,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
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
