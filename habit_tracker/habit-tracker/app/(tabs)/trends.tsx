import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { colors, spacing, typography } from "@/constants/theme";
import { useHabits } from "@/storage/HabitsContext";
import {
  bestPerformingHabit,
  monthlyGrowthPercent,
  mostImprovedHabit,
  weeklyCompletionData
} from "@/utils/habitAnalytics";

export default function TrendsScreen() {
  const { activeHabits } = useHabits();
  const month = new Date();
  const growth = monthlyGrowthPercent(activeHabits, month);
  const weekly = weeklyCompletionData(activeHabits, month);
  const best = bestPerformingHabit(activeHabits, month);
  const improved = mostImprovedHabit(activeHabits, month);

  return (
    <ScreenShell>
      <View>
        <Text style={styles.kicker}>Trends</Text>
        <Text style={styles.title}>Progress signals</Text>
      </View>

      <AppCard style={styles.boostCard}>
        <Text style={styles.boostLabel}>Progress Boost</Text>
        <Text style={styles.boostTitle}>{growth >= 0 ? "+" : ""}{Math.round(growth)} pts</Text>
        <Text style={styles.boostBody}>Monthly completion compared with the previous month.</Text>
      </AppCard>

      <SectionHeader title="Weekly Completion" />
      <View style={styles.weeklyCard}>
        {weekly.map((point) => (
          <View key={point.label} style={styles.weekPoint}>
            <View style={[styles.bar, { height: Math.max(12, point.rate) }]} />
            <Text style={styles.weekLabel}>{point.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Top Performance" value={best?.title ?? "None"} helper={best?.icon} tone="success" />
        <StatCard label="Greatest Growth" value={improved?.title ?? "None"} helper={improved?.icon} tone="primary" />
      </View>

      <SectionHeader title="Achievements" />
      <AppCard>
        <Text style={styles.achievementTitle}>Steady starter</Text>
        <Text style={styles.achievementBody}>Complete any habit today to build your next achievement.</Text>
      </AppCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800"
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "900"
  },
  boostCard: {
    backgroundColor: colors.primary
  },
  boostLabel: {
    color: colors.onPrimary,
    fontSize: typography.small,
    fontWeight: "800",
    opacity: 0.8
  },
  boostTitle: {
    color: colors.onPrimary,
    fontSize: 42,
    fontWeight: "900",
    marginTop: spacing.sm
  },
  boostBody: {
    color: colors.onPrimary,
    fontSize: typography.small,
    marginTop: spacing.xs,
    opacity: 0.82
  },
  weeklyCard: {
    alignItems: "flex-end",
    backgroundColor: colors.surface,
    borderRadius: 24,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    minHeight: 170,
    padding: spacing.xl
  },
  weekPoint: {
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
    justifyContent: "flex-end"
  },
  bar: {
    backgroundColor: colors.success,
    borderRadius: 999,
    maxHeight: 100,
    width: "100%"
  },
  weekLabel: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: "800"
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md
  },
  achievementTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "900"
  },
  achievementBody: {
    color: colors.textSoft,
    fontSize: typography.small,
    marginTop: spacing.xs
  }
});
