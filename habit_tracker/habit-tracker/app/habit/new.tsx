import { router } from "expo-router";

import { HabitFormScreen } from "@/components/HabitFormScreen";
import { useHabits } from "@/storage/HabitsContext";
import { NewHabitInput } from "@/types/habit";

export default function NewHabitScreen() {
  const { createHabit } = useHabits();

  const handleSave = async (input: NewHabitInput) => {
    const habit = await createHabit(input);
    router.replace(`/habit/${habit.id}`);
  };

  return <HabitFormScreen mode="create" onSave={handleSave} />;
}
