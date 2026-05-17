import { StyleSheet, View } from "react-native";

import { colors, spacing } from "@/constants/theme";
import { Habit } from "@/types/habit";
import { getWeekDays } from "@/utils/habitDates";

type WeeklyProgressProps = {
  habit: Habit;
  compact?: boolean;
};

export function WeeklyProgress({ habit, compact }: WeeklyProgressProps) {
  const completed = new Set(habit.completedDates);
  const weekDays = getWeekDays();

  return (
    <View style={[styles.row, compact ? styles.compactRow : null]}>
      {weekDays.map((day) => (
        <View
          key={day}
          style={[
            styles.square,
            compact ? styles.compactSquare : null,
            completed.has(day) ? styles.squareDone : null
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm
  },
  compactRow: {
    gap: 5
  },
  square: {
    backgroundColor: "rgba(0,0,0,0.24)",
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 8,
    borderWidth: 1,
    height: 26,
    width: 26
  },
  compactSquare: {
    borderRadius: 5,
    height: 15,
    width: 15
  },
  squareDone: {
    backgroundColor: colors.text,
    borderColor: colors.text
  }
});
