import { useLocalSearchParams, router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionSheet } from "@/components/ActionSheet";
import { CalendarGrid } from "@/components/CalendarGrid";
import { StatTile } from "@/components/StatTile";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useActionSheet } from "@/hooks/useActionSheet";
import { useHabits } from "@/storage/HabitsContext";
import {
  formatDuration,
  formatFrequency,
  getCurrentMonthDays,
  getDayKey,
  getHabitStreak,
  getMonthCompletionCount,
  getWeeklyCompletionCount
} from "@/utils/habitDates";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, toggleDate, archiveHabit } = useHabits();
  const actions = useActionSheet();
  const habit = id ? getHabit(id) : undefined;

  if (!habit) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.missing}>Habit not found.</Text>
      </SafeAreaView>
    );
  }

  const monthDays = getCurrentMonthDays();
  const todayKey = getDayKey(new Date());
  const streak = getHabitStreak(habit);
  const monthCount = getMonthCompletionCount(habit, monthDays);
  const weekCount = getWeeklyCompletionCount(habit);

  const confirmArchive = () => {
    actions.close();
    Alert.alert("Archive habit?", "Archived habits disappear from the home grid.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Archive",
        style: "destructive",
        onPress: async () => {
          await archiveHabit(habit.id);
          router.replace("/");
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()} style={styles.navButton}>
            <Text style={styles.navText}>‹</Text>
          </Pressable>
          <Pressable onPress={actions.open} style={styles.navButton}>
            <Text style={styles.menuText}>•••</Text>
          </Pressable>
        </View>

        <View style={[styles.hero, { backgroundColor: habit.color }]}>
          <Text style={styles.icon}>{habit.icon}</Text>
          <Text style={styles.title}>{habit.title}</Text>
          <Text style={styles.frequency}>{formatFrequency(habit)}</Text>
          <WeeklyProgress habit={habit} />
        </View>

        <View style={styles.stats}>
          <StatTile label="Streak" value={`${streak}`} helper="days" />
          <StatTile
            label="This week"
            value={`${weekCount}`}
            helper={habit.frequency === "weekly" ? `of ${habit.weeklyTarget}` : "done"}
          />
          <StatTile label="This month" value={`${monthCount}`} helper="days" />
          <StatTile label="Duration" value={formatDuration(habit.createdAt)} helper="active" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly progress</Text>
          <CalendarGrid
            days={monthDays}
            completedDates={habit.completedDates}
            onToggle={(dateKey) => toggleDate(habit.id, dateKey)}
          />
        </View>

        <Pressable
          style={[
            styles.todayButton,
            habit.completedDates.includes(todayKey) ? styles.todayButtonDone : null
          ]}
          onPress={() => toggleDate(habit.id, todayKey)}
        >
          <Text style={styles.todayButtonText}>
            {habit.completedDates.includes(todayKey) ? "Completed today" : "Mark today complete"}
          </Text>
        </Pressable>
      </ScrollView>

      <ActionSheet visible={actions.visible} onClose={actions.close}>
        <Pressable
          style={styles.sheetRow}
          onPress={() => {
            actions.close();
            router.push(`/habit/${habit.id}/edit`);
          }}
        >
          <Text style={styles.sheetText}>Edit habit</Text>
        </Pressable>
        <Pressable style={styles.sheetRow} onPress={confirmArchive}>
          <Text style={[styles.sheetText, styles.destructive]}>Archive habit</Text>
        </Pressable>
      </ActionSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl
  },
  missing: {
    color: colors.text,
    padding: spacing.lg
  },
  nav: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    marginTop: spacing.sm
  },
  navButton: {
    alignItems: "center",
    backgroundColor: colors.cardRaised,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  navText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36
  },
  menuText: {
    color: colors.text,
    fontSize: 18,
    letterSpacing: 0
  },
  hero: {
    borderRadius: radius.xl,
    minHeight: 230,
    overflow: "hidden",
    padding: spacing.lg
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: spacing.xs
  },
  frequency: {
    color: colors.textSoft,
    fontSize: 16,
    marginBottom: spacing.xl
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.lg
  },
  section: {
    marginTop: spacing.xl
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0,
    marginBottom: spacing.md
  },
  todayButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    padding: spacing.lg
  },
  todayButtonDone: {
    backgroundColor: colors.green
  },
  todayButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "700"
  },
  sheetRow: {
    paddingVertical: spacing.lg
  },
  sheetText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center"
  },
  destructive: {
    color: colors.roseText
  }
});
