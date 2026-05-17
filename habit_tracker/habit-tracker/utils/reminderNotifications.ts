import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { AppSettings, WeekdayLabel } from "@/types/settings";

export const REMINDER_NOTIFICATION_PREFIX = "habitflow-reminder-";
const DAILY_REMINDER_ID = `${REMINDER_NOTIFICATION_PREFIX}daily`;
const REMINDER_CHANNEL_ID = "habit-reminders";

const WEEKDAY_TO_EXPO: Record<WeekdayLabel, number> = {
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
  Sat: 7
};

let handlerConfigured = false;
let androidChannelReady = false;

export function isExpoNotificationsInstalled() {
  return true;
}

export function configureNotificationHandler() {
  if (handlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false
    })
  });
  handlerConfigured = true;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android" || androidChannelReady) {
    return;
  }

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: "Habit reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 200, 120, 200],
    lightColor: "#3525CD",
    sound: "default"
  });
  androidChannelReady = true;
}

function notificationContent() {
  return {
    title: "HabitFlow",
    body: "Time to check in on your habits.",
    sound: "default" as const,
    ...(Platform.OS === "android" ? { channelId: REMINDER_CHANNEL_ID } : {})
  };
}

export async function requestNotificationPermission(): Promise<boolean> {
  configureNotificationHandler();
  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === "granted") {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true
    }
  });

  return requested.status === "granted";
}

export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelReminderNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(REMINDER_NOTIFICATION_PREFIX))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}

export function parseReminderTime(reminderTime: string) {
  const [hourPart, minutePart] = reminderTime.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return { hour: 8, minute: 0 };
  }

  return {
    hour: Math.min(23, Math.max(0, hour)),
    minute: Math.min(59, Math.max(0, minute))
  };
}

export function formatReminderTime(hour: number, minute: number) {
  return `${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}`;
}

export function shiftReminderTime(reminderTime: string, deltaMinutes: number) {
  const { hour, minute } = parseReminderTime(reminderTime);
  const total = hour * 60 + minute + deltaMinutes;
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return formatReminderTime(Math.floor(normalized / 60), normalized % 60);
}

export async function scheduleReminders(settings: AppSettings) {
  if (!settings.dailyReminderEnabled) {
    return;
  }

  configureNotificationHandler();
  await ensureAndroidChannel();
  await cancelReminderNotifications();

  const { hour, minute } = parseReminderTime(settings.reminderTime);
  const content = notificationContent();
  const channelId = Platform.OS === "android" ? REMINDER_CHANNEL_ID : undefined;

  if (settings.reminderFrequency === "daily") {
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_REMINDER_ID,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        ...(channelId ? { channelId } : {})
      }
    });
    return;
  }

  for (const day of settings.weeklyReminderDays) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${REMINDER_NOTIFICATION_PREFIX}${day.toLowerCase()}`,
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: WEEKDAY_TO_EXPO[day],
        hour,
        minute,
        ...(channelId ? { channelId } : {})
      }
    });
  }
}

/** Re-apply schedules from saved settings (e.g. after app launch). */
export async function syncRemindersFromSettings(settings: AppSettings) {
  if (!settings.dailyReminderEnabled || !settings.pushNotificationsEnabled) {
    return;
  }

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== "granted") {
    return;
  }

  await scheduleReminders(settings);
}
