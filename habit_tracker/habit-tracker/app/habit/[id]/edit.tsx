import { router, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HabitFormScreen } from "@/components/HabitFormScreen";
import { colors, spacing } from "@/constants/theme";
import { useHabits } from "@/storage/HabitsContext";
import { NewHabitInput } from "@/types/habit";

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getHabit, updateHabit } = useHabits();
  const habit = id ? getHabit(id) : undefined;

  if (!habit) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.text}>Habit not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async (input: NewHabitInput) => {
    await updateHabit(habit.id, input);
    router.back();
  };

  return <HabitFormScreen mode="edit" habit={habit} onSave={handleSave} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black
  },
  text: {
    color: colors.text,
    padding: spacing.lg
  }
});
