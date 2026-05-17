import { Link, router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { HabitCard } from "@/components/HabitCard";
import { colors, spacing, typography } from "@/constants/theme";
import { useHabits } from "@/storage/HabitsContext";

export default function HomeScreen() {
  const { activeHabits, toggleToday } = useHabits();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Today</Text>
          <Text style={styles.title}>Habits</Text>
        </View>
        <Link href="/habit/new" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addText}>+</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={activeHabits}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          activeHabits.length === 0 ? styles.emptyList : null
        ]}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onPress={() => router.push(`/habit/${item.id}`)}
            onToggle={() => toggleToday(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md
  },
  kicker: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 2
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "700",
    letterSpacing: 0
  },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.cardRaised,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  addText: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center"
  },
  row: {
    gap: spacing.md
  }
});
