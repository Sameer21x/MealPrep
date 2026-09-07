import type { ReactNode } from 'react';
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radii } from '@/constants/dimensions';
import { spacing } from '@/constants/spacing';

export function MealCardShell({
  children,
  customStyle,
}: {
  children: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
}) {
  const { width } = useWindowDimensions();
  return (
    <View
      style={[
        styles.card,
        {
          width: width * 0.8,
        },
        customStyle,
      ]}
    >
      {children}
    </View>
  );
}

export const CARD_PADDING = spacing.xl;

const styles = StyleSheet.create({
  card: {
    height: 530,
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    overflow: 'hidden',
  },
});
