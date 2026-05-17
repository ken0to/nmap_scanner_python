import { StyleSheet, Text } from "react-native";

import { colors, typography } from "@/constants/theme";
import { AppCard } from "./ui/AppCard";

export function AIInsightsCard() {
  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>AI insights</Text>
      <Text style={styles.body}>Personal habit insights will appear here.</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLavender
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800"
  },
  body: {
    color: colors.textSoft,
    fontSize: typography.small,
    marginTop: 4
  }
});
