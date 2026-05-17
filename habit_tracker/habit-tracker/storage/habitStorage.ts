import AsyncStorage from "@react-native-async-storage/async-storage";

import { Habit } from "@/types/habit";

const HABITS_KEY = "habit-bloom:habits";

export async function loadHabits(): Promise<Habit[]> {
  const raw = await AsyncStorage.getItem(HABITS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Habit[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHabits(habits: Habit[]) {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
