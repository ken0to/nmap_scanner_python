import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { loadSettings, mergeSettings, saveSettings } from "@/storage/settingsStorage";
import {
  AppSettings,
  DEFAULT_SETTINGS,
  ReminderFrequency,
  WEEKDAY_LABELS,
  WeekdayLabel
} from "@/types/settings";
import {
  cancelAllScheduledNotifications,
  cancelReminderNotifications,
  configureNotificationHandler,
  requestNotificationPermission,
  scheduleReminders,
  shiftReminderTime,
  syncRemindersFromSettings
} from "@/utils/reminderNotifications";

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const settingsRef = useRef<AppSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        configureNotificationHandler();
        const loaded = await loadSettings();
        if (!mounted) {
          return;
        }

        settingsRef.current = loaded;
        setSettings(loaded);
        await syncRemindersFromSettings(loaded);
      } finally {
        if (mounted) {
          setIsHydrated(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSettingsSync = useCallback((patch: Partial<AppSettings>) => {
    const next = mergeSettings(settingsRef.current, patch);
    settingsRef.current = next;
    setSettings(next);
    return next;
  }, []);

  const persistSettings = useCallback(async (next: AppSettings) => {
    await saveSettings(next);
  }, []);

  const handlePushToggle = (enabled: boolean) => {
    void (async () => {
      if (enabled) {
        let next = updateSettingsSync({ pushNotificationsEnabled: true });
        await persistSettings(next);

        const granted = await requestNotificationPermission();
        if (!granted) {
          next = updateSettingsSync({ pushNotificationsEnabled: false });
          await persistSettings(next);
          return;
        }

        if (next.dailyReminderEnabled) {
          await scheduleReminders(next);
        }
        return;
      }

      await cancelAllScheduledNotifications();
      const next = updateSettingsSync({ pushNotificationsEnabled: false });
      await persistSettings(next);
    })();
  };

  const handleDailyReminderToggle = (enabled: boolean) => {
    void (async () => {
      if (!enabled) {
        await cancelReminderNotifications();
        const next = updateSettingsSync({ dailyReminderEnabled: false });
        await persistSettings(next);
        return;
      }

      let next = updateSettingsSync({ dailyReminderEnabled: true });
      await persistSettings(next);

      if (!next.pushNotificationsEnabled) {
        const granted = await requestNotificationPermission();
        if (!granted) {
          next = updateSettingsSync({
            pushNotificationsEnabled: false,
            dailyReminderEnabled: false
          });
          await persistSettings(next);
          return;
        }

        next = updateSettingsSync({
          pushNotificationsEnabled: true,
          dailyReminderEnabled: true
        });
        await persistSettings(next);
      }

      await scheduleReminders(next);
    })();
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    const next = updateSettingsSync({ darkModeEnabled: enabled });
    void persistSettings(next);
  };

  const updateReminderSettings = (patch: Partial<AppSettings>) => {
    void (async () => {
      const next = updateSettingsSync(patch);
      await persistSettings(next);
      if (next.dailyReminderEnabled && next.pushNotificationsEnabled) {
        await scheduleReminders(next);
      }
    })();
  };

  if (!isHydrated) {
    return (
      <ScreenShell>
        <View>
          <Text style={styles.kicker}>Settings</Text>
          <Text style={styles.title}>Your space</Text>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View>
        <Text style={styles.kicker}>Settings</Text>
        <Text style={styles.title}>Your space</Text>
      </View>

      <AppCard style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>H</Text>
        </View>
        <View>
          <Text style={styles.profileTitle}>HabitFlow User</Text>
          <Text style={styles.profileMeta}>Premium habit tracking</Text>
        </View>
      </AppCard>

      <SectionHeader title="Preferences" />
      <AppCard padded={false}>
        <SettingRow
          label="Push notifications"
          value={settings.pushNotificationsEnabled}
          onValueChange={handlePushToggle}
        />
        <SettingRow
          label="Daily reminder"
          value={settings.dailyReminderEnabled}
          onValueChange={handleDailyReminderToggle}
        />
        {settings.dailyReminderEnabled ? (
          <ReminderSettingsPanel
            frequency={settings.reminderFrequency}
            reminderTime={settings.reminderTime}
            weeklyDays={settings.weeklyReminderDays}
            onFrequencyChange={(reminderFrequency) => updateReminderSettings({ reminderFrequency })}
            onTimeChange={(reminderTime) => updateReminderSettings({ reminderTime })}
            onWeeklyDaysChange={(weeklyReminderDays) => updateReminderSettings({ weeklyReminderDays })}
          />
        ) : null}
        <SettingRow
          label="Dark mode"
          value={settings.darkModeEnabled}
          isLast
          onValueChange={handleDarkModeToggle}
        />
      </AppCard>

      <AppCard padded={false}>
        <ActionRow label="Export data" />
        <ActionRow label="Clear all data" destructive />
      </AppCard>
    </ScreenShell>
  );
}

function ReminderSettingsPanel({
  frequency,
  reminderTime,
  weeklyDays,
  onFrequencyChange,
  onTimeChange,
  onWeeklyDaysChange
}: {
  frequency: ReminderFrequency;
  reminderTime: string;
  weeklyDays: WeekdayLabel[];
  onFrequencyChange: (frequency: ReminderFrequency) => void;
  onTimeChange: (time: string) => void;
  onWeeklyDaysChange: (days: WeekdayLabel[]) => void;
}) {
  const toggleWeekday = (day: WeekdayLabel) => {
    const next = weeklyDays.includes(day)
      ? weeklyDays.filter((value) => value !== day)
      : [...weeklyDays, day];
    onWeeklyDaysChange(next.length > 0 ? next : [day]);
  };

  return (
    <View style={styles.reminderPanel}>
      <Text style={styles.panelLabel}>Frequency</Text>
      <View style={styles.pillRow}>
        <Pill label="Daily" selected={frequency === "daily"} onPress={() => onFrequencyChange("daily")} />
        <Pill label="Weekly" selected={frequency === "weekly"} onPress={() => onFrequencyChange("weekly")} />
      </View>

      <Text style={styles.panelLabel}>Time</Text>
      <View style={styles.timeRow}>
        <Pressable
          onPress={() => onTimeChange(shiftReminderTime(reminderTime, -15))}
          style={({ pressed }) => [styles.timeButton, pressed ? styles.pillPressed : null]}
        >
          <Text style={styles.timeButtonText}>−</Text>
        </Pressable>
        <Text style={styles.timeValue}>{reminderTime}</Text>
        <Pressable
          onPress={() => onTimeChange(shiftReminderTime(reminderTime, 15))}
          style={({ pressed }) => [styles.timeButton, pressed ? styles.pillPressed : null]}
        >
          <Text style={styles.timeButtonText}>+</Text>
        </Pressable>
      </View>

      {frequency === "weekly" ? (
        <>
          <Text style={styles.panelLabel}>Days</Text>
          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((day) => (
              <Pill
                key={day}
                compact
                label={day}
                selected={weeklyDays.includes(day)}
                onPress={() => toggleWeekday(day)}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

function Pill({
  label,
  selected,
  onPress,
  compact = false
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        compact ? styles.pillCompact : null,
        selected ? styles.pillSelected : null,
        pressed ? styles.pillPressed : null
      ]}
    >
      <Text style={[styles.pillText, selected ? styles.pillTextSelected : null]}>{label}</Text>
    </Pressable>
  );
}

function SettingRow({
  label,
  value,
  onValueChange,
  isLast = false
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.settingRow, isLast ? styles.settingRowLast : null]}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.switchSlot}>
        <Switch
          value={value}
          onValueChange={(next) => onValueChange(next)}
          trackColor={{ false: "#E6EEFF", true: colors.surfaceMint }}
          ios_backgroundColor="#E6EEFF"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          {...(Platform.OS === "android"
            ? { thumbColor: value ? colors.surface : "#F4F4F5" }
            : null)}
        />
      </View>
    </View>
  );
}

function ActionRow({ label, destructive = false }: { label: string; destructive?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, destructive ? styles.destructive : null]}>{label}</Text>
      <Text style={[styles.chevron, destructive ? styles.destructive : null]}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800"
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "900"
  },
  profile: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surfaceLavender,
    borderRadius: radius.pill,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  avatarText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900"
  },
  profileTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "900"
  },
  profileMeta: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginTop: 2
  },
  settingRow: {
    alignItems: "center",
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 60,
    paddingLeft: spacing.xl,
    paddingRight: 20
  },
  settingRowLast: {
    borderBottomWidth: 0
  },
  settingLabel: {
    color: colors.text,
    flex: 1,
    flexShrink: 1,
    fontSize: typography.body,
    fontWeight: "700",
    paddingRight: spacing.md
  },
  switchSlot: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 52
  },
  reminderPanel: {
    backgroundColor: colors.surfaceSoft,
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md
  },
  panelLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "700",
    marginTop: spacing.xs
  },
  pillRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  weekdayRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  pill: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  pillCompact: {
    minWidth: 44,
    paddingHorizontal: spacing.sm
  },
  pillSelected: {
    backgroundColor: colors.surfaceMint,
    borderColor: colors.successDark
  },
  pillPressed: {
    opacity: 0.85
  },
  pillText: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: "700",
    textAlign: "center"
  },
  pillTextSelected: {
    color: colors.successDark
  },
  timeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  timeButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  timeButtonText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24
  },
  timeValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
    minWidth: 64,
    textAlign: "center"
  },
  row: {
    alignItems: "center",
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 60,
    paddingHorizontal: spacing.xl
  },
  rowLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700"
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 26
  },
  destructive: {
    color: colors.danger
  }
});
