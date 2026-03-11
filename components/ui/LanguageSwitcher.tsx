/**
 * Compact language switcher: EN | SV.
 * Tap to switch between English and Swedish. Selection persists.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/theme/colors';
import { BORDER_RADIUS } from '@/constants/theme/primitives';
import { SPACING } from '@/constants/theme/spacing';
import { TYPOGRAPHY_BASE } from '@/constants/theme/typography';
import { useI18n } from '@/context/I18nContext';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setLocale('en')}
        style={({ pressed }) => [
          styles.option,
          locale === 'en' && styles.optionActive,
          pressed && styles.optionPressed,
        ]}
        accessibilityLabel="Switch to English"
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.optionText,
            locale === 'en' ? styles.optionTextActive : styles.optionTextInactive,
          ]}
        >
          EN
        </Text>
      </Pressable>
      <View style={styles.divider} />
      <Pressable
        onPress={() => setLocale('sv')}
        style={({ pressed }) => [
          styles.option,
          locale === 'sv' && styles.optionActive,
          pressed && styles.optionPressed,
        ]}
        accessibilityLabel="Byt till svenska"
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.optionText,
            locale === 'sv' ? styles.optionTextActive : styles.optionTextInactive,
          ]}
        >
          SV
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 10, 64, 0.6)',
    borderRadius: BORDER_RADIUS.x4,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: 2,
  },
  option: {
    paddingVertical: SPACING.x1,
    paddingHorizontal: SPACING.x3,
    borderRadius: BORDER_RADIUS.x3,
  },
  optionActive: {
    backgroundColor: 'rgba(165, 107, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(220, 181, 255, 0.6)',
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionText: {
    ...TYPOGRAPHY_BASE.small,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.textPrimary,
  },
  optionTextInactive: {
    color: COLORS.textDisabled,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.borderSubtle,
  },
});
