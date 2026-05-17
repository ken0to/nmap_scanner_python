import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { habitColors, icons } from "@/constants/theme";
import { Habit, NewHabitInput } from "@/types/habit";
import { getDayKey } from "@/utils/habitDates";
import { loadHabits, saveHabits } from "./habitStorage";

type HabitsContextValue = {
  habits: Habit[];
  activeHabits: Habit[];
  getHabit: (id: string) => Habit | undefined;
  createHabit: (input: NewHabitInput) => Promise<Habit>;
  updateHabit: (id: string, input: NewHabitInput) => Promise<void>;
  toggleToday: (id: string) => Promise<void>;
  toggleDate: (id: string, dateKey: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

const starterHabits: Habit[] = [
  {
    id: "starter-morning-walk",
    title: "Morning walk",
    icon: "🏃",
    color: habitColors[3],
    frequency: "daily",
    weeklyTarget: 7,
    completedDates: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "starter-read",
    title: "Read",
    icon: "📚",
    color: habitColors[1],
    frequency: "weekly",
    weeklyTarget: 4,
    completedDates: [],
    createdAt: new Date().toISOString()
  }
];

function makeId() {
  return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function HabitsProvider({ children }: PropsWithChildren) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    loadHabits().then((stored) => {
      setHabits(stored.length > 0 ? stored : starterHabits);
    });
  }, []);

  const persist = useCallback(async (updater: (current: Habit[]) => Habit[]) => {
    setHabits((current) => {
      const next = updater(current);
      saveHabits(next);
      return next;
    });
  }, []);

  const createHabit = useCallback(
    async (input: NewHabitInput) => {
      const habit: Habit = {
        id: makeId(),
        title: input.title.trim(),
        icon: input.icon || icons[0],
        color: input.color || habitColors[0],
        frequency: input.frequency,
        weeklyTarget: input.frequency === "daily" ? 7 : input.weeklyTarget,
        completedDates: [],
        createdAt: new Date().toISOString()
      };
      await persist((current) => [habit, ...current]);
      return habit;
    },
    [persist]
  );

  const updateHabit = useCallback(
    async (id: string, input: NewHabitInput) => {
      await persist((current) =>
        current.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                title: input.title.trim(),
                icon: input.icon,
                color: input.color,
                frequency: input.frequency,
                weeklyTarget: input.frequency === "daily" ? 7 : input.weeklyTarget
              }
            : habit
        )
      );
    },
    [persist]
  );

  const toggleDate = useCallback(
    async (id: string, dateKey: string) => {
      await persist((current) =>
        current.map((habit) => {
          if (habit.id !== id) {
            return habit;
          }
          const exists = habit.completedDates.includes(dateKey);
          const completedDates = exists
            ? habit.completedDates.filter((date) => date !== dateKey)
            : [...habit.completedDates, dateKey].sort();
          return { ...habit, completedDates };
        })
      );
    },
    [persist]
  );

  const toggleToday = useCallback(
    (id: string) => toggleDate(id, getDayKey(new Date())),
    [toggleDate]
  );

  const archiveHabit = useCallback(
    async (id: string) => {
      await persist((current) =>
        current.map((habit) =>
          habit.id === id ? { ...habit, archivedAt: new Date().toISOString() } : habit
        )
      );
    },
    [persist]
  );

  const value = useMemo<HabitsContextValue>(
    () => ({
      habits,
      activeHabits: habits.filter((habit) => !habit.archivedAt),
      getHabit: (id) => habits.find((habit) => habit.id === id),
      createHabit,
      updateHabit,
      toggleToday,
      toggleDate,
      archiveHabit
    }),
    [archiveHabit, createHabit, habits, toggleDate, toggleToday, updateHabit]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used inside HabitsProvider");
  }
  return context;
}
