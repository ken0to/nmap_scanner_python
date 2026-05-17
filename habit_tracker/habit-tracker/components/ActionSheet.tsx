import { BlurView } from "expo-blur";
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";

type ActionSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function ActionSheet({ visible, onClose, children }: ActionSheetProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)"
  },
  sheet: {
    backgroundColor: colors.cardRaised,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    bottom: 0,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    position: "absolute",
    right: 0
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.24)",
    borderRadius: 2,
    height: 4,
    marginBottom: spacing.md,
    width: 42
  }
});
