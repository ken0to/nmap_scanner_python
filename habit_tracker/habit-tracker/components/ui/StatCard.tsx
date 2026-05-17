import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";
import { AppCard } from "./AppCard";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: "primary" | "success" | "neutral";
};

export function StatCard({ label, value, helper, tone = "neutral" }: StatCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={[styles.badge, styles[tone]]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 140
  },
  badge: {
    borderRadius: 4,
    height: 8,
    marginBottom: spacing.sm,
    width: 36
  },
  neutral: {
    backgroundColor: colors.border
  },
  primary: {
    backgroundColor: colors.primary
  },
  success: {
    backgroundColor: colors.success
  },
  value: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800"
  },
  label: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: "700"
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.small
  }
});
