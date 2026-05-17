import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";
import { parseDayKey } from "@/utils/habitDates";

type CalendarGridProps = {
  days: string[];
  completedDates: string[];
  onToggle: (dateKey: string) => void;
};

export function CalendarGrid({ days, completedDates, onToggle }: CalendarGridProps) {
  const completed = new Set(completedDates);

  return (
    <View style={styles.grid}>
      {days.map((day) => {
        const date = parseDayKey(day);
        const isDone = completed.has(day);
        return (
          <Pressable
            key={day}
            onPress={() => onToggle(day)}
            style={[styles.day, isDone ? styles.dayDone : null]}
          >
            <Text style={[styles.dayText, isDone ? styles.dayTextDone : null]}>
              {date.getDate()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  day: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: colors.cardRaised,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    width: "12.2%"
  },
  dayDone: {
    backgroundColor: colors.text
  },
  dayText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  dayTextDone: {
    color: colors.black
  }
});
