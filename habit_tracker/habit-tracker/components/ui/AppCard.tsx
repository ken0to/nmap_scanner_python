import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius, shadows, spacing } from "@/constants/theme";

type AppCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}>;

export function AppCard({ children, padded = true, style }: AppCardProps) {
  return <View style={[styles.card, padded ? styles.padded : null, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadows.card
  },
  padded: {
    padding: spacing.xl
  }
});
