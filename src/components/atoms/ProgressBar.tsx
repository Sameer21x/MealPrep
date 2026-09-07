import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { progressHeight, radii } from '@/constants/dimensions';

type ProgressBarSize = keyof typeof progressHeight;

type ProgressBarProps = {
  value: number;
  size?: ProgressBarSize;
  color?: string;
  trackColor?: string;
  animated?: boolean;
  duration?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function clampRatio(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function ProgressBar({
  value,
  size = 'md',
  color = colors.accent,
  trackColor = colors.surfaceMuted,
  animated = true,
  duration = 320,
  accessibilityLabel,
  style,
}: ProgressBarProps) {
  const ratio = clampRatio(value);
  const [progress] = useState(() => new Animated.Value(ratio));

  useEffect(() => {
    if (!animated) {
      progress.setValue(ratio);
      return;
    }

    const transition = Animated.timing(progress, {
      toValue: ratio,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    transition.start();

    return () => transition.stop();
  }, [animated, duration, progress, ratio]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}
      style={[styles.track, { height: progressHeight[size], backgroundColor: trackColor }, style]}
    >
      <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: 'stretch',
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
