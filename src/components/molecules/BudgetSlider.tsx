import { useMemo, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';

const TRACK_HEIGHT = 16;
const THUMB_SIZE = 64;

type BudgetSliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

function clamp(value: number, low: number, high: number) {
  return Math.min(high, Math.max(low, value));
}

export function BudgetSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  style,
}: BudgetSliderProps) {
  const [width, setWidth] = useState(0);

  const travel = Math.max(0, width - THUMB_SIZE);
  const ratio = max > min ? clamp((value - min) / (max - min), 0, 1) : 0;
  const offset = ratio * travel;

  const panResponder = useMemo(() => {
    const emit = (touchX: number) => {
      if (travel <= 0) {
        return;
      }

      const position = clamp(touchX - THUMB_SIZE / 2, 0, travel);
      const raw = min + (position / travel) * (max - min);
      const next = clamp(Math.round(raw / step) * step, min, max);

      if (next !== value) {
        onChange(next);
      }
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => emit(event.nativeEvent.locationX),
      onPanResponderMove: (event) => emit(event.nativeEvent.locationX),
    });
  }, [max, min, onChange, step, travel, value]);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={onLayout}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') {
          onChange(clamp(value + step, min, max));
        }

        if (event.nativeEvent.actionName === 'decrement') {
          onChange(clamp(value - step, min, max));
        }
      }}
      style={[styles.container, style]}
    >
      <View pointerEvents="none" style={styles.track} />
      <View pointerEvents="none" style={[styles.thumb, { left: offset }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
