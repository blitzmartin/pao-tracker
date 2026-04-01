import { AppColors } from "@/utils/Theme";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";

export default function RootLayout() {
  const appTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: AppColors.brandColor,
      secondary: AppColors.tintColor,
    },
  };
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  /**
   * (Foreground Handler)
   * Questo handler istruisce l'app su come comportarsi quando arriva una
   * notifica mentre l'utente sta usando l'app (app in primo piano).
   * Senza questo, le notifiche verrebbero ricevute ma non mostrate come banner.
   */
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider theme={appTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-beauty"
          options={{ title: "Add Beauty Product" }}
        />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
