// app/_layout.tsx

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from 'react-redux';
import store from '../store/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const customCardStyleInterpolator = ({ current, layouts }: any) => ({
  cardStyle: {
    opacity: current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      { perspective: 1000 },
      {
        rotateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "0deg"],
        }),
      },
      {
        scale: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  },
});

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
  const queryClient = new QueryClient();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}> 

      <Stack
        screenOptions={{
          headerShown: false, // Hide headers for all stack screens
          // cardStyleInterpolator: customCardStyleInterpolator, // Apply custom transitions
        }}
      >
        {/* <Slot /> Render nested navigators/screens */}
      </Stack>
      </Provider>
    </QueryClientProvider>
  );
}

