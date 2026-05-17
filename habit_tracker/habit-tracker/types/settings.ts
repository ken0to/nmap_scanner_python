export type ReminderFrequency = "daily" | "weekly";

export type WeekdayLabel = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type AppSettings = {
  pushNotificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  reminderFrequency: ReminderFrequency;
  reminderTime: string;
  weeklyReminderDays: WeekdayLabel[];
  darkModeEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  pushNotificationsEnabled: false,
  dailyReminderEnabled: false,
  reminderFrequency: "daily",
  reminderTime: "08:00",
  weeklyReminderDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  darkModeEnabled: false
};

export const WEEKDAY_LABELS: WeekdayLabel[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
