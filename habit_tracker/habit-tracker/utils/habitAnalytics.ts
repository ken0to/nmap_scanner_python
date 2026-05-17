import { Habit } from "@/types/habit";
import { getDayKey, parseDayKey } from "./habitDates";

type Period = {
  start: Date;
  end: Date;
};

export type WeeklyCompletionPoint = {
  label: string;
  actual: number;
  expected: number;
  rate: number;
};

const dayMs = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function monthPeriod(month: Date): Period {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return { start, end };
}

function previousMonth(month: Date) {
  return new Date(month.getFullYear(), month.getMonth() - 1, 1);
}

function daysBetween(start: Date, end: Date) {
  return Math.floor((startOfDay(end).getTime() - startOfDay(start).getTime()) / dayMs) + 1;
}

function isHabitActiveOn(habit: Habit, date: Date) {
  const createdAt = startOfDay(new Date(habit.createdAt));
  const archivedAt = habit.archivedAt ? startOfDay(new Date(habit.archivedAt)) : undefined;
  return date >= createdAt && (!archivedAt || date <= archivedAt);
}

function activePeriodForHabit(habit: Habit, period: Period): Period | null {
  const createdAt = startOfDay(new Date(habit.createdAt));
  const archivedAt = habit.archivedAt ? startOfDay(new Date(habit.archivedAt)) : period.end;
  const start = createdAt > period.start ? createdAt : period.start;
  const end = archivedAt < period.end ? archivedAt : period.end;

  if (end < start) {
    return null;
  }

  return { start, end };
}

function countCalendarWeeksTouched(period: Period) {
  const weekKeys = new Set<string>();
  const cursor = startOfDay(period.start);

  while (cursor <= period.end) {
    const weekStart = new Date(cursor);
    const day = weekStart.getDay();
    weekStart.setDate(cursor.getDate() - (day === 0 ? 6 : day - 1));
    weekKeys.add(getDayKey(weekStart));
    cursor.setDate(cursor.getDate() + 1);
  }

  return weekKeys.size;
}

function expectedCompletions(habit: Habit, period: Period) {
  const activePeriod = activePeriodForHabit(habit, period);

  if (!activePeriod) {
    return 0;
  }

  if (habit.frequency === "daily") {
    return daysBetween(activePeriod.start, activePeriod.end);
  }

  return habit.weeklyTarget * countCalendarWeeksTouched(activePeriod);
}

function actualCompletions(habit: Habit, period: Period) {
  return habit.completedDates.filter((dateKey) => {
    const date = parseDayKey(dateKey);
    return date >= period.start && date <= period.end && isHabitActiveOn(habit, date);
  }).length;
}

function completionRateForPeriod(habits: Habit[], period: Period) {
  const totals = habits.reduce(
    (acc, habit) => {
      acc.actual += actualCompletions(habit, period);
      acc.expected += expectedCompletions(habit, period);
      return acc;
    },
    { actual: 0, expected: 0 }
  );

  if (totals.expected === 0) {
    return 0;
  }

  return (totals.actual / totals.expected) * 100;
}

export function monthlyCompletionRate(habits: Habit[], month: Date) {
  return completionRateForPeriod(habits, monthPeriod(month));
}

export function previousMonthCompletionRate(habits: Habit[], month: Date) {
  return monthlyCompletionRate(habits, previousMonth(month));
}

export function monthlyGrowthPercent(habits: Habit[], month: Date) {
  return monthlyCompletionRate(habits, month) - previousMonthCompletionRate(habits, month);
}

export function consistencyScore(habits: Habit[], period: Period) {
  return completionRateForPeriod(habits, period);
}

export function weeklyCompletionData(habits: Habit[], month: Date): WeeklyCompletionPoint[] {
  const { start, end } = monthPeriod(month);
  const points: WeeklyCompletionPoint[] = [];
  const cursor = startOfDay(start);
  let weekIndex = 1;

  while (cursor <= end) {
    const weekEnd = new Date(cursor);
    weekEnd.setDate(cursor.getDate() + 6);
    const period = { start: new Date(cursor), end: weekEnd > end ? end : weekEnd };
    const expected = habits.reduce((sum, habit) => sum + expectedCompletions(habit, period), 0);
    const actual = habits.reduce((sum, habit) => sum + actualCompletions(habit, period), 0);

    points.push({
      label: `W${weekIndex}`,
      actual,
      expected,
      rate: expected === 0 ? 0 : (actual / expected) * 100
    });

    cursor.setDate(cursor.getDate() + 7);
    weekIndex += 1;
  }

  return points;
}

export function bestPerformingHabit(habits: Habit[], month: Date) {
  const period = monthPeriod(month);
  return habits
    .map((habit) => ({
      habit,
      rate: completionRateForPeriod([habit], period)
    }))
    .sort((a, b) => b.rate - a.rate)[0]?.habit;
}

export function mostImprovedHabit(habits: Habit[], month: Date) {
  const current = monthPeriod(month);
  const previous = monthPeriod(previousMonth(month));

  return habits
    .map((habit) => ({
      habit,
      growth: completionRateForPeriod([habit], current) - completionRateForPeriod([habit], previous)
    }))
    .sort((a, b) => b.growth - a.growth)[0]?.habit;
}

export function getCurrentMonthPeriod(anchor = new Date()) {
  return monthPeriod(anchor);
}
