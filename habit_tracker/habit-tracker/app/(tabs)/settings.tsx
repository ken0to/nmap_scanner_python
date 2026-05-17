import { StyleSheet, Switch, Text, View } from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { ScreenShell } from "@/components/ui/ScreenShell";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function SettingsScreen() {
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
        <SettingRow label="Push notifications" />
        <SettingRow label="Daily reminder" />
        <SettingRow label="Dark mode" />
      </AppCard>

      <AppCard padded={false}>
        <ActionRow label="Export data" />
        <ActionRow label="Clear all data" destructive />
      </AppCard>
    </ScreenShell>
  );
}

function SettingRow({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={false}
        trackColor={{ false: colors.surfaceSoft, true: colors.surfaceMint }}
        thumbColor={colors.surface}
      />
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
