import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";

type StatTileProps = {
  label: string;
  value: string;
  helper: string;
};

export function StatTile({ label, value, helper }: StatTileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.cardRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    padding: spacing.lg
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: spacing.md
  },
  value: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0
  },
  helper: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2
  }
});
