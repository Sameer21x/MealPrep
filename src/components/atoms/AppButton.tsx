import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon, type AppIconName } from '@/components/atoms/AppIcon';
import { AppText, type AppTextVariant } from '@/components/atoms/AppText';
import { colors } from '@/constants/colors';
import { controlHeight, iconSize, radii } from '@/constants/dimensions';
import { spacing } from '@/constants/spacing';

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';
type AppButtonSize = 'sm' | 'md' | 'lg' | 'xl';

type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: AppIconName;
  rightIcon?: AppIconName;
  style?: StyleProp<ViewStyle>;
};

const contentColor: Record<AppButtonVariant, string> = {
  primary: colors.surface,
  secondary: colors.accent,
  ghost: colors.accent,
};

const labelVariant: Record<AppButtonSize, AppTextVariant> = {
  sm: 'label',
  md: 'button',
  lg: 'button',
  xl: 'buttonLarge',
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  disabled,
  accessibilityLabel,
  style,
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const tint = isDisabled ? colors.disabledText : contentColor[variant];
  const glyphSize = size === 'sm' ? iconSize.sm : iconSize.md;

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { height: controlHeight[size] },
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && (variant === 'ghost' ? styles.disabledGhost : styles.disabled),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tint} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <AppIcon name={leftIcon} size={glyphSize} color={tint} /> : null}
          <AppText variant={labelVariant[size]} color={tint} numberOfLines={1}>
            {title}
          </AppText>
          {rightIcon ? <AppIcon name={rightIcon} size={glyphSize} color={tint} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.accentMuted,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    backgroundColor: colors.surfaceMuted,
  },
  disabledGhost: {
    backgroundColor: 'transparent',
  },
});
