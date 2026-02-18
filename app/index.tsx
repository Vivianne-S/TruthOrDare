import { router } from "expo-router";
import { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";

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
