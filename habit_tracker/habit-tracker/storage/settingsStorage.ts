import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppSettings, DEFAULT_SETTINGS, WEEKDAY_LABELS, WeekdayLabel } from "@/types/settings";

const SETTINGS_KEY = "habit-bloom:settings";

function isWeekdayLabel(value: string): value is WeekdayLabel {
  return WEEKDAY_LABELS.includes(value as WeekdayLabel);
}

function normalizeSettings(raw: Partial<AppSettings> | null): AppSettings {
  if (!raw) {
    return DEFAULT_SETTINGS;
  }

  const weeklyReminderDays = Array.isArray(raw.weeklyReminderDays)
    ? raw.weeklyReminderDays.filter(isWeekdayLabel)
    : DEFAULT_SETTINGS.weeklyReminderDays;

  return {
    pushNotificationsEnabled: Boolean(raw.pushNotificationsEnabled),
    dailyReminderEnabled: Boolean(raw.dailyReminderEnabled),
    reminderFrequency: raw.reminderFrequency === "weekly" ? "weekly" : "daily",
    reminderTime: typeof raw.reminderTime === "string" ? raw.reminderTime : DEFAULT_SETTINGS.reminderTime,
    weeklyReminderDays: weeklyReminderDays.length > 0 ? weeklyReminderDays : DEFAULT_SETTINGS.weeklyReminderDays,
    darkModeEnabled: Boolean(raw.darkModeEnabled)
  };
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return DEFAULT_SETTINGS;
  }

  try {
    return normalizeSettings(JSON.parse(raw) as Partial<AppSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function mergeSettings(current: AppSettings, patch: Partial<AppSettings>): AppSettings {
  return normalizeSettings({ ...current, ...patch });
}

export async function saveSettings(settings: AppSettings) {
  const normalized = normalizeSettings(settings);
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(normalized));
}
