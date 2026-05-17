import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/theme";

type ScreenShellProps = PropsWithChildren<{
  scroll?: boolean;
  bottomInset?: number;
}>;

export function ScreenShell({ children, scroll = true, bottomInset = 110 }: ScreenShellProps) {
  if (!scroll) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={[styles.content, { paddingBottom: bottomInset }]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md
  }
});
