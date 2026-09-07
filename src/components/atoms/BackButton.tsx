import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/atoms/AppIcon';
import { colors } from '@/constants/colors';
import { hairline, hitSlop, radii, shadows } from '@/constants/dimensions';

type BackButtonVariant = 'muted' | 'surface' | 'plain';

type BackButtonProps = {
  onPress: () => void;
  variant?: BackButtonVariant;
  icon?: AppIconName;
  size?: number;
  color?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({
  onPress,
  variant = 'muted',
  icon = 'chevron-back',
  size = 28,
  color = colors.text,
  disabled = false,
  accessibilityLabel,
  style,
}: BackButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop.md}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? t('common.back')}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'muted' && styles.muted,
        variant === 'surface' && styles.surface,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <AppIcon
        name={icon}
        size={Math.round(size * 0.57)}
        color={disabled ? colors.disabledText : color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  surface: {
    backgroundColor: colors.surface,
    borderWidth: hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.6,
  },
});
