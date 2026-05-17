import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

type ProgressRingProps = {
  value: number;
  size?: number;
};

const TRACK_COLOR = "#DEE9FC";
const STROKE = 8;

export function ProgressRing({ value, size = 96 }: ProgressRingProps) {
  const progress = Math.max(0, Math.min(100, value));
  const displayValue = Math.round(progress);
  const half = size / 2;
  const angle = (progress / 100) * 360;

  const rightRotation = Math.min(angle, 180) - 180;
  const leftRotation = angle > 180 ? angle - 360 : -180;

  const ringStyle = {
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: STROKE,
    borderColor: colors.primary
  };

  return (
    <View style={[styles.wrap, { height: size, width: size }]}>
      <View style={[styles.track, ringStyle, { borderColor: TRACK_COLOR }]} />

      {angle > 0 ? (
        <View style={[styles.fill, { height: size, width: size }]}>
          <View style={[styles.clip, { height: size, right: 0, width: half }]}>
            <View
              style={[
                ringStyle,
                styles.rotator,
                { left: -half, transform: [{ rotate: `${rightRotation}deg` }] }
              ]}
            />
          </View>

          {angle > 180 ? (
            <View style={[styles.clip, { height: size, left: 0, width: half }]}>
              <View
                style={[
                  ringStyle,
                  styles.rotator,
                  { left: 0, transform: [{ rotate: `${leftRotation}deg` }] }
                ]}
              />
            </View>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.value}>{displayValue}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  track: {
    position: "absolute"
  },
  fill: {
    position: "absolute"
  },
  clip: {
    overflow: "hidden",
    position: "absolute",
    top: 0
  },
  rotator: {
    position: "absolute",
    top: 0
  },
  value: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "600"
  }
});
