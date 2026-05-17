import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";

export function EmptyState() {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["rgba(105,112,90,0.9)", "rgba(109,90,141,0.82)"]}
        style={styles.card}
      >
        <Text style={styles.icon}>🌿</Text>
        <Text style={styles.title}>Build your first rhythm</Text>
        <Text style={styles.copy}>Create a habit and watch the week fill in one quiet square at a time.</Text>
        <Link href="/habit/new" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Create habit</Text>
          </Pressable>
        </Link>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.sm
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl
  },
  icon: {
    fontSize: 38,
    marginBottom: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0,
    marginBottom: spacing.sm
  },
  copy: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: spacing.lg
  },
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  buttonText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "800"
  }
});
