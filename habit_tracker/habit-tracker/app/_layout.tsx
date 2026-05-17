import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { HabitsProvider } from "@/storage/HabitsContext";
import { configureNotificationHandler } from "@/utils/reminderNotifications";

export default function RootLayout() {
  useEffect(() => {
    configureNotificationHandler();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <HabitsProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: "fade_from_bottom"
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="habit" />
          </Stack>
        </HabitsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
