import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';

const LOGO_SCREEN_DURATION_MS = 2000;

export default function IntroLogoScreen() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/how-to-play');
    }, LOGO_SCREEN_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/purple_galaxy.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image
          source={require('@/assets/images/app_icon.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
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
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: '92%',
    maxWidth: 420,
    height: '68%',
    maxHeight: 640,
  },
});
