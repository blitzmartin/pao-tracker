import {
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";



export default function RootLayout() {
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
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      // Aggiungi queste due righe per risolvere l'errore TypeScript:
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
    <PaperProvider
    >
      <ThemeProvider value={DefaultTheme}>
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
      </ThemeProvider>
    </PaperProvider>
  );
}
