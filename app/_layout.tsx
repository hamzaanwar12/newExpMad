// app/_layout.tsx
import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Slot } from "expo-router"; // Import Slot
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    BarlowRegular: require("../assets/fonts/Barlow-Regular.ttf"),
    BarlowBold: require("../assets/fonts/Barlow-Bold.ttf"),
    BarlowExtraBold: require("../assets/fonts/Barlow-ExtraBold.ttf"),
    BarlowLight: require("../assets/fonts/Barlow-Light.ttf"),
    BarlowSemiBold: require("../assets/fonts/Barlow-SemiBold.ttf"),
    BarlowMedium: require("../assets/fonts/Barlow-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for all stack screens
      }}
    >
      <Slot /> {/* Render nested navigators/screens */}
    </Stack>
  );
}
