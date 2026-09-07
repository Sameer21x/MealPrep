import { useEffect, useState } from 'react';
import { Animated, StyleSheet, type DimensionValue } from 'react-native';

import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const PULSE_MS = 900;
const DIM = 0.55;

type SkeletonBlockProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

export function SkeletonBlock({
  width = '100%',
  height = 16,
  radius = radii.sm,
}: SkeletonBlockProps) {
  const reduceMotion = useReduceMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: DIM, duration: PULSE_MS, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_MS, useNativeDriver: true }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [opacity, reduceMotion]);

  return <Animated.View style={[styles.block, { width, height, borderRadius: radius, opacity }]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfaceMuted,
  },
});
