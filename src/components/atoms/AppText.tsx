import { Text, type TextProps } from 'react-native';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export type AppTextVariant = keyof typeof typography;

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: string;
};

export function AppText({ variant = 'body', color = colors.text, style, ...rest }: AppTextProps) {
  return <Text {...rest} style={[typography[variant], { color }, style]} />;
}
