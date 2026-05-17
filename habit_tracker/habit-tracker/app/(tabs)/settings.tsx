import { useState } from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
          value={pushNotifications}
          onValueChange={setPushNotifications}
        />
        <SettingRow label="Daily reminder" value={dailyReminder} onValueChange={setDailyReminder} />
        <SettingRow label="Dark mode" value={darkMode} onValueChange={setDarkMode} />
      </AppCard>

      <AppCard padded={false}>
        <ActionRow label="Export data" />
        <ActionRow label="Clear all data" destructive />
      </AppCard>
    </ScreenShell>
  );
}

function SettingRow({
  label,
  value,
  onValueChange
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.switchSlot}>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#E6EEFF", true: colors.surfaceMint }}
          ios_backgroundColor="#E6EEFF"
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
