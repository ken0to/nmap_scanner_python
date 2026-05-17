import { router } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { habitColors, icons, colors, radius, spacing, typography } from "@/constants/theme";
import { Habit, HabitFrequency, NewHabitInput } from "@/types/habit";

type HabitFormScreenProps = {
  mode: "create" | "edit";
  habit?: Habit;
  onSave: (input: NewHabitInput) => Promise<void>;
};

export function HabitFormScreen({ mode, habit, onSave }: HabitFormScreenProps) {
  const [title, setTitle] = useState(habit?.title ?? "");
  const [icon, setIcon] = useState(habit?.icon ?? icons[0]);
  const [color, setColor] = useState(habit?.color ?? habitColors[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency ?? "daily");
  const [weeklyTarget, setWeeklyTarget] = useState(habit?.weeklyTarget ?? 3);
  const canSave = title.trim().length > 0;

  const targetOptions = useMemo(() => [1, 2, 3, 4, 5, 6, 7], []);

  const submit = async () => {
    if (!canSave) {
      return;
    }
    await onSave({ title, icon, color, frequency, weeklyTarget });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.nav}>
            <Pressable onPress={() => router.back()} style={styles.navButton}>
              <Text style={styles.navText}>‹</Text>
            </Pressable>
            <Text style={styles.navTitle}>{mode === "create" ? "New habit" : "Edit habit"}</Text>
            <View style={styles.navButton} />
          </View>

          <View style={[styles.preview, { backgroundColor: color }]}>
            <Text style={styles.previewIcon}>{icon}</Text>
            <Text style={styles.previewTitle}>{title.trim() || "Untitled habit"}</Text>
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            autoFocus
            placeholder="Meditate"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Icon</Text>
          <View style={styles.pickerRow}>
            {icons.map((option) => (
              <Pressable
                key={option}
                onPress={() => setIcon(option)}
                style={[styles.iconChoice, icon === option ? styles.choiceSelected : null]}
              >
                <Text style={styles.iconChoiceText}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Color</Text>
          <View style={styles.pickerRow}>
            {habitColors.map((option) => (
              <Pressable
                key={option}
                onPress={() => setColor(option)}
                style={[
                  styles.colorChoice,
                  { backgroundColor: option },
                  color === option ? styles.choiceSelected : null
                ]}
              />
            ))}
          </View>

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.segment}>
            {(["daily", "weekly"] as HabitFrequency[]).map((option) => (
              <Pressable
                key={option}
                onPress={() => setFrequency(option)}
                style={[styles.segmentItem, frequency === option ? styles.segmentActive : null]}
              >
                <Text style={[styles.segmentText, frequency === option ? styles.segmentTextActive : null]}>
                  {option === "daily" ? "Daily" : "Weekly"}
                </Text>
              </Pressable>
            ))}
          </View>

          {frequency === "weekly" ? (
            <>
              <Text style={styles.label}>Weekly target</Text>
              <View style={styles.targetRow}>
                {targetOptions.map((target) => (
                  <Pressable
                    key={target}
                    onPress={() => setWeeklyTarget(target)}
                    style={[styles.target, weeklyTarget === target ? styles.targetActive : null]}
                  >
                    <Text style={[styles.targetText, weeklyTarget === target ? styles.targetTextActive : null]}>
                      {target}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={!canSave}
            onPress={submit}
            style={[styles.saveButton, !canSave ? styles.saveButtonDisabled : null]}
          >
            <Text style={styles.saveText}>{mode === "create" ? "Create habit" : "Save changes"}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.black
  },
  keyboard: {
    flex: 1
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  nav: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  navButton: {
    alignItems: "center",
    backgroundColor: colors.cardRaised,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  navText: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 36
  },
  navTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700"
  },
  preview: {
    borderRadius: radius.xl,
    minHeight: 160,
    justifyContent: "flex-end",
    marginBottom: spacing.xl,
    padding: spacing.lg
  },
  previewIcon: {
    fontSize: 38,
    marginBottom: spacing.md
  },
  previewTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
    letterSpacing: 0
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    textTransform: "uppercase"
  },
  input: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.lg,
    color: colors.text,
    fontSize: 18,
    padding: spacing.lg
  },
  pickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  iconChoice: {
    alignItems: "center",
    backgroundColor: colors.cardRaised,
    borderRadius: 20,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  iconChoiceText: {
    fontSize: 24
  },
  colorChoice: {
    borderRadius: 20,
    height: 48,
    width: 48
  },
  choiceSelected: {
    borderColor: colors.text,
    borderWidth: 2
  },
  segment: {
    backgroundColor: colors.cardRaised,
    borderRadius: radius.lg,
    flexDirection: "row",
    padding: spacing.xs
  },
  segmentItem: {
    alignItems: "center",
    borderRadius: radius.md,
    flex: 1,
    paddingVertical: spacing.md
  },
  segmentActive: {
    backgroundColor: colors.text
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "700"
  },
  segmentTextActive: {
    color: colors.black
  },
  targetRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  target: {
    alignItems: "center",
    backgroundColor: colors.cardRaised,
    borderRadius: 18,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  targetActive: {
    backgroundColor: colors.text
  },
  targetText: {
    color: colors.textMuted,
    fontWeight: "800"
  },
  targetTextActive: {
    color: colors.black
  },
  footer: {
    backgroundColor: colors.black,
    padding: spacing.lg
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: radius.lg,
    padding: spacing.lg
  },
  saveButtonDisabled: {
    opacity: 0.35
  },
  saveText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "800"
  }
});
