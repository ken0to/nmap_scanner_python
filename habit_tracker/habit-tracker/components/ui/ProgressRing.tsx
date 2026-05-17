import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors } from "@/constants/theme";

type ProgressRingProps = {
  value: number;
  size?: number;
};

const TRACK_COLOR = "#DEE9FC";
const STROKE = 8;
const DURATION_MS = 550;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function getStrokeOffset(progressPercent: number, circumference: number) {
  const clamped = Math.max(0, Math.min(100, progressPercent));
  return circumference - (clamped / 100) * circumference;
}

export function ProgressRing({ value, size = 96 }: ProgressRingProps) {
  const progress = Math.max(0, Math.min(100, value));
  const displayValue = Math.round(progress);
  const center = size / 2;
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedOffset = useRef(new Animated.Value(getStrokeOffset(progress, circumference))).current;

  useEffect(() => {
    Animated.timing(animatedOffset, {
      toValue: getStrokeOffset(progress, circumference),
      duration: DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [animatedOffset, circumference, progress]);

  return (
    <View style={[styles.wrap, { height: size, width: size }]}>
      <Svg height={size} style={styles.svg} width={size}>
        <Circle
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          stroke={TRACK_COLOR}
          strokeWidth={STROKE}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          fill="transparent"
          origin={`${center}, ${center}`}
          r={radius}
          rotation={-90}
          stroke={colors.primary}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={animatedOffset}
          strokeLinecap="round"
          strokeWidth={STROKE}
        />
      </Svg>
      <Text style={styles.value}>{displayValue}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  svg: {
    position: "absolute"
  },
  value: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "600"
  }
});
