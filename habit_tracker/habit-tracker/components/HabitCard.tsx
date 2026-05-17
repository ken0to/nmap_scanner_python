import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, radius, spacing, typography } from "@/constants/theme";
import { Habit } from "@/types/habit";
import { formatFrequency, getDayKey } from "@/utils/habitDates";
import { WeeklyProgress } from "./WeeklyProgress";

type HabitCardProps = {
  habit: Habit;
  onPress: () => void;
  onToggle: () => void;
};

export function HabitCard({ habit, onPress, onToggle }: HabitCardProps) {
  const isDoneToday = habit.completedDates.includes(getDayKey(new Date()));

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <LinearGradient
        colors={[habit.color, "rgba(22,22,24,0.95)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.top}>
          <Text style={styles.icon}>{habit.icon}</Text>
          <Pressable
            hitSlop={10}
            onPress={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            style={[styles.check, isDoneToday ? styles.checkDone : null]}
          >
            <Text style={[styles.checkText, isDoneToday ? styles.checkTextDone : null]}>
              {isDoneToday ? "✓" : ""}
            </Text>
          </Pressable>
        </View>
        <Text numberOfLines={2} style={styles.title}>{habit.title}</Text>
        <Text style={styles.frequency}>{formatFrequency(habit)}</Text>
        <WeeklyProgress habit={habit} compact />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginBottom: spacing.md
  },
  card: {
    borderRadius: radius.xl,
    minHeight: 190,
    overflow: "hidden",
    padding: spacing.md
  },
  top: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  icon: {
    fontSize: 30
  },
  check: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.24)",
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  checkDone: {
    backgroundColor: colors.text
  },
  checkText: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "900"
  },
  checkTextDone: {
    color: colors.black
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
    letterSpacing: 0,
    minHeight: 42
  },
  frequency: {
    color: colors.textSoft,
    fontSize: typography.small,
    marginBottom: spacing.lg,
    marginTop: spacing.xs
  }
});
