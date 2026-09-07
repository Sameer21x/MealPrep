import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/atoms/AppIcon';
import { AppText } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { hitSlop, iconSize } from '@/constants/dimensions';
import { spacing } from '@/constants/spacing';

type IngredientRowProps = {
  name: string;
  quantity: string;
  checked: boolean;
  onToggle: () => void;
};

export const IngredientRow = memo(function IngredientRow({
  name,
  quantity,
  checked,
  onToggle,
}: IngredientRowProps) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={hitSlop.sm}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={`${name}, ${quantity}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AppIcon
        name={checked ? 'checkmark-circle' : 'ellipse-outline'}
        size={iconSize.lg}
        color={checked ? colors.accent : colors.surfaceMuted}
      />
      <View style={styles.text}>
        <AppText
          variant="label"
          color={checked ? colors.textMuted : colors.text}
          style={checked && styles.struck}
        >
          {name}
        </AppText>
      </View>
      <AppText variant="meta" color={colors.textMuted}>
        {quantity}
      </AppText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    flex: 1,
  },
  struck: {
    textDecorationLine: 'line-through',
  },
  pressed: {
    opacity: 0.7,
  },
});
