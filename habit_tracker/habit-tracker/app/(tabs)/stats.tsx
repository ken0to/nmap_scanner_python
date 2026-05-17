import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useHabits } from "@/storage/HabitsContext";
import { getCurrentMonthDays, getHabitStreak } from "@/utils/habitDates";
import { monthlyCompletionRate } from "@/utils/habitAnalytics";

export default function StatsScreen() {
  const { activeHabits } = useHabits();
  const month = new Date();
  const monthDays = getCurrentMonthDays(month);
  const completedDates = new Set(activeHabits.flatMap((habit) => habit.completedDates));
  const averageRate = monthlyCompletionRate(activeHabits, month);
  const longestStreak = activeHabits.reduce((max, habit) => Math.max(max, getHabitStreak(habit)), 0);

  return (
    <ScreenShell>
      <View>
        <Text style={styles.kicker}>Stats</Text>
        <Text style={styles.title}>Monthly rhythm</Text>
      </View>

      <AppCard>
        <View style={styles.calendarHeader}>
          <Text style={styles.cardTitle}>
            {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </Text>
          <Text style={styles.cardMeta}>{Math.round(averageRate)}%</Text>
        </View>
        <View style={styles.calendar}>
          {monthDays.map((dayKey) => (
            <View
              key={dayKey}
              style={[styles.calendarDay, completedDates.has(dayKey) ? styles.calendarDone : null]}
            >
              <Text style={[styles.calendarText, completedDates.has(dayKey) ? styles.calendarTextDone : null]}>
                {Number(dayKey.slice(-2))}
              </Text>
            </View>
          ))}
        </View>
      </AppCard>

      <View style={styles.statsGrid}>
        <StatCard label="Completion" value={`${Math.round(averageRate)}%`} helper="this month" tone="primary" />
        <StatCard label="Best streak" value={`${longestStreak}`} helper="days" tone="success" />
      </View>

      <SectionHeader title="Habit performance" />
      <View style={styles.performanceList}>
        {activeHabits.map((habit) => (
          <AppCard key={habit.id} style={styles.performanceItem}>
            <Text style={styles.habitIcon}>{habit.icon}</Text>
            <View style={styles.performanceBody}>
              <Text style={styles.habitTitle}>{habit.title}</Text>
              <Text style={styles.habitMeta}>{habit.completedDates.length} total completions</Text>
            </View>
          </AppCard>
        ))}
      </View>
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
  calendarHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "900"
  },
  cardMeta: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "900"
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  calendarDay: {
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.sm,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  calendarDone: {
    backgroundColor: colors.surfaceMint
  },
  calendarText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700"
  },
  calendarTextDone: {
    color: colors.successDark
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md
  },
  performanceList: {
    gap: spacing.md
  },
  performanceItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg
  },
  habitIcon: {
    fontSize: 24
  },
  performanceBody: {
    flex: 1
  },
  habitTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800"
  },
  habitMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: 2
  }
});
