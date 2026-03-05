/**
 * Splash/intro screen shown when the app launches.
 * Displays the logo for a fixed duration, then navigates to the how-to-play screen.
 */
import { router } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";

// How long the splash screen is visible before auto-navigation
const LOGO_SCREEN_DURATION_MS = 2000;

export default function IntroLogoScreen() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace("/how-to-play");
    }, LOGO_SCREEN_DURATION_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/SplashBigger.png")}
      resizeMode="cover"
      style={styles.background}
    ></ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  logo: {
    width: "92%",
    maxWidth: 420,
    height: "68%",
    maxHeight: 640,
  },
});
