import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/constants/theme";

type SectionHeaderProps = {
  title: string;
  action?: string;
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "700"
  },
  action: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: "700"
  }
});
