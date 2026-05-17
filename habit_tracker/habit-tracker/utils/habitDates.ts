import { Habit } from "@/types/habit";

const dayMs = 24 * 60 * 60 * 1000;

export function getDayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDayKey(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getWeekDays(anchor = new Date()) {
  const day = anchor.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(anchor);
    date.setHours(0, 0, 0, 0);
    date.setDate(anchor.getDate() + mondayOffset + index);
    return getDayKey(date);
  });
}

export function getCurrentMonthDays(anchor = new Date()) {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1);
    return getDayKey(date);
  });
}

export function getWeeklyCompletionCount(habit: Habit) {
  const week = getWeekDays();
  return week.filter((day) => habit.completedDates.includes(day)).length;
}

export function getMonthCompletionCount(habit: Habit, monthDays = getCurrentMonthDays()) {
  return monthDays.filter((day) => habit.completedDates.includes(day)).length;
}

export function getHabitStreak(habit: Habit) {
  let streak = 0;
  const completed = new Set(habit.completedDates);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (completed.has(getDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function formatFrequency(habit: Habit) {
  if (habit.frequency === "daily") {
    return "Daily";
  }
  return `${habit.weeklyTarget} times per week`;
}

export function formatDuration(createdAt: string) {
  const start = new Date(createdAt).getTime();
  const diff = Math.max(1, Math.ceil((Date.now() - start) / dayMs));
  return `${diff}d`;
}
