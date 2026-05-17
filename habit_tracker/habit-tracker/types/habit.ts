export type HabitFrequency = "daily" | "weekly";

export type Habit = {
  id: string;
  title: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  weeklyTarget: number;
  completedDates: string[];
  createdAt: string;
  archivedAt?: string;
};

export type NewHabitInput = {
  title: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  weeklyTarget: number;
};
