import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type ProgressRingProps = {
  value: number;
  size?: number;
};

const TRACK_COLOR = "#DEE9FC";
const SEGMENT_COUNT = 100;

export function ProgressRing({ value, size = 96 }: ProgressRingProps) {
  const progress = Math.max(0, Math.min(100, value));
  const displayValue = Math.round(progress);
  const filledSegments = displayValue;
  const center = size / 2;
  const stroke = 8;
  const segmentLength = stroke + 2;
  const segmentWidth = Math.max(3, stroke * 0.45);
  const ringRadius = center - segmentLength / 2;

  return (
    <View style={[styles.wrap, { height: size, width: size }]}>
      {Array.from({ length: SEGMENT_COUNT }, (_, index) => {
        const angle = -90 + (360 / SEGMENT_COUNT) * index;
        const radians = (angle * Math.PI) / 180;
        const x = center + Math.cos(radians) * ringRadius;
        const y = center + Math.sin(radians) * ringRadius;
        const isFilled = index < filledSegments;

        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                backgroundColor: isFilled ? colors.primary : TRACK_COLOR,
                borderRadius: segmentWidth,
                height: segmentLength,
                left: x - segmentWidth / 2,
                top: y - segmentLength / 2,
                transform: [{ rotate: `${angle + 90}deg` }],
                width: segmentWidth
              }
            ]}
          />
        );
      })}
      <Text style={styles.value}>{displayValue}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  segment: {
    position: "absolute"
  },
  value: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "600"
  }
});
