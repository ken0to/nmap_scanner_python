import { Link, router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { AppCard } from "@/components/ui/AppCard";
import { HabitListItem } from "@/components/ui/HabitListItem";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { colors, radius, shadows } from "@/constants/theme";
import { useHabits } from "@/storage/HabitsContext";
import { getDayKey, getWeekDays } from "@/utils/habitDates";

const SCREEN_MARGIN = 16;
const SECTION_GAP = 40;
const TAB_BAR_CLEARANCE = 110;
const FAB_SIZE = 56;

export default function TodayScreen() {
  const { activeHabits, toggleToday } = useHabits();
  const todayKey = getDayKey(new Date());
  const completedToday = activeHabits.filter((habit) => habit.completedDates.includes(todayKey)).length;
  const completionRate = activeHabits.length === 0 ? 0 : (completedToday / activeHabits.length) * 100;
  const weekDays = getWeekDays();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <Text pointerEvents="none" style={styles.headerTitle}>
            HabitFlow
          </Text>
          <View style={styles.calendarButton}>
            <View style={styles.calendarTop} />
            <View style={styles.calendarBody} />
          </View>
        </View>

        <View style={styles.week}>
          {weekDays.map((dayKey) => {
            const date = new Date(`${dayKey}T00:00:00`);
            const isToday = dayKey === todayKey;
            return (
              <View key={dayKey} style={[styles.day, isToday ? styles.dayActive : null]}>
                <Text style={[styles.dayName, isToday ? styles.dayNameActive : null]}>
                  {date.toLocaleDateString(undefined, { weekday: "short" })}
                </Text>
                <Text style={[styles.dayNumber, isToday ? styles.dayNumberActive : null]}>
                  {date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>

        <AppCard padded={false} style={styles.focusCard}>
          <View style={styles.focusText}>
            <Text style={styles.focusKicker}>FOCUS OF THE DAY</Text>
            <Text style={styles.focusTitle}>Wellness Momentum</Text>
            <Text style={styles.focusBody}>
              You{"'"}ve completed {completedToday} out of {activeHabits.length} habits today. Keep the streak
              alive!
            </Text>
          </View>
          <ProgressRing value={completionRate} size={96} />
        </AppCard>

        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Habits</Text>
            <Text style={styles.sectionAction}>Edit List</Text>
          </View>
          <View style={styles.list}>
            {activeHabits.length === 0 ? (
              <EmptyState />
            ) : (
              activeHabits.map((habit) => (
                <HabitListItem
                  key={habit.id}
                  habit={habit}
                  onPress={() => router.push(`/habit/${habit.id}`)}
                  onToggle={() => toggleToday(habit.id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <Link href="/habit/new" asChild>
        <TouchableOpacity activeOpacity={0.86} style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    paddingBottom: TAB_BAR_CLEARANCE + FAB_SIZE + 24,
    paddingHorizontal: SCREEN_MARGIN,
    paddingTop: 8
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SECTION_GAP,
    minHeight: 40
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#DEE9FC",
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700"
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "600",
    left: 0,
    lineHeight: 32,
    position: "absolute",
    right: 0,
    textAlign: "center"
  },
  calendarButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderRadius: 3,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    width: 27
  },
  calendarTop: {
    backgroundColor: colors.primary,
    height: 2,
    left: 4,
    position: "absolute",
    right: 4,
    top: 7
  },
  calendarBody: {
    borderTopColor: colors.primary,
    borderTopWidth: 2,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 9
  },
  week: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SECTION_GAP,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...shadows.card,
    shadowOpacity: 0.04,
    shadowRadius: 20
  },
  day: {
    alignItems: "center",
    borderRadius: 8,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  dayActive: {
    backgroundColor: colors.primary
  },
  dayName: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16
  },
  dayNameActive: {
    color: colors.onPrimary
  },
  dayNumber: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24
  },
  dayNumberActive: {
    color: colors.onPrimary
  },
  focusCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
    marginBottom: SECTION_GAP,
    padding: 24
  },
  focusText: {
    flex: 1
  },
  focusKicker: {
    color: colors.successDark,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.8,
    lineHeight: 20,
    textTransform: "uppercase"
  },
  focusTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    marginTop: 4
  },
  focusBody: {
    color: colors.textSoft,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    marginTop: 12
  },
  habitsSection: {
    gap: 24
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32
  },
  sectionAction: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20
  },
  list: {
    gap: 24
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: FAB_SIZE / 2,
    bottom: 24,
    elevation: 8,
    height: FAB_SIZE,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: FAB_SIZE,
    zIndex: 10
  },
  fabText: {
    color: colors.onPrimary,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -2
  }
});
