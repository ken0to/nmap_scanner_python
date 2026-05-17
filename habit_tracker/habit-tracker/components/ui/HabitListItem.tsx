import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius } from "@/constants/theme";
import { Habit } from "@/types/habit";
import { getDayKey, getHabitStreak } from "@/utils/habitDates";
import { AppCard } from "./AppCard";

type HabitListItemProps = {
  habit: Habit;
  onPress: () => void;
  onToggle: () => void;
};

const ICON_SIZE = 48;

export function HabitListItem({ habit, onPress, onToggle }: HabitListItemProps) {
  const isDoneToday = habit.completedDates.includes(getDayKey(new Date()));
  const streak = getHabitStreak(habit);

  return (
    <Pressable onPress={onPress}>
      <AppCard padded={false} style={[styles.card, isDoneToday ? styles.cardDone : null]}>
        <View style={[styles.iconBubble, isDoneToday ? styles.iconDone : styles.iconPending]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <View style={styles.body}>
          <Text numberOfLines={1} style={styles.title}>
            {habit.title}
          </Text>
          <Text style={[styles.meta, isDoneToday ? styles.metaDone : styles.metaPending]}>
            {streak} day streak
          </Text>
        </View>
        <Pressable
          hitSlop={10}
          onPress={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          style={[styles.check, isDoneToday ? styles.checkDone : styles.checkPending]}
        >
          <Text style={[styles.checkText, isDoneToday ? styles.checkTextDone : null]}>
            {isDoneToday ? "✓" : ""}
          </Text>
        </Pressable>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
    padding: 24
  },
  cardDone: {
    borderColor: "rgba(195, 236, 215, 0.55)"
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: ICON_SIZE,
    justifyContent: "center",
    width: ICON_SIZE
  },
  iconDone: {
    backgroundColor: colors.surfaceMint
  },
  iconPending: {
    backgroundColor: "#DEE9FC"
  },
  icon: {
    fontSize: 22
  },
  body: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24
  },
  meta: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 4
  },
  metaDone: {
    color: colors.successDark
  },
  metaPending: {
    color: colors.textMuted
  },
  check: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: ICON_SIZE,
    justifyContent: "center",
    width: ICON_SIZE
  },
  checkDone: {
    backgroundColor: colors.surfaceMint
  },
  checkPending: {
    backgroundColor: colors.surface,
    borderColor: "#DEE9FC",
    borderWidth: 2
  },
  checkText: {
    color: "#DEE9FC",
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 24
  },
  checkTextDone: {
    color: colors.successDark,
    fontSize: 20,
    fontWeight: "800"
  }
});
