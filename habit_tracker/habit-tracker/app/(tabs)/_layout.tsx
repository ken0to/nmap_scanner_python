import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "@/constants/theme";

type TabGlyphProps = {
  focused: boolean;
  kind: "today" | "stats" | "trends" | "settings";
};

function TabGlyph({ focused, kind }: TabGlyphProps) {
  return (
    <View style={[styles.glyph, focused ? styles.glyphFocused : null]}>
      {kind === "today" ? <View style={styles.dot} /> : null}
      {kind === "stats" ? <Text style={styles.glyphText}>%</Text> : null}
      {kind === "trends" ? <Text style={styles.glyphText}>^</Text> : null}
      {kind === "settings" ? <Text style={styles.glyphText}>:</Text> : null}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
          height: 86,
          paddingBottom: 22,
          paddingTop: 10
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} kind="today" />
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} kind="stats" />
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} kind="trends" />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} kind="settings" />
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  glyph: {
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.pill,
    height: 26,
    justifyContent: "center",
    width: 34
  },
  glyphFocused: {
    backgroundColor: colors.surfaceLavender
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10
  },
  glyphText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18
  }
});
