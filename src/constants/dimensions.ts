import { Platform, StyleSheet } from 'react-native';

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xxl: 32,
  pill: 999,
} as const;

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const controlHeight = {
  sm: 40,
  md: 48,
  lg: 56,
  xl: 72,
} as const;

export const progressHeight = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
} as const;

export const hitSlop = {
  sm: { top: 8, right: 8, bottom: 8, left: 8 },
  md: { top: 12, right: 12, bottom: 12, left: 12 },
} as const;

export const gridBreakpoint = 720;

export const shadows = Platform.select({
  ios: {
    card: {
      shadowColor: '#1C1917',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
  },
  default: {
    card: {
      elevation: 2,
    },
  },
}) ?? { card: {} };

export const hairline = StyleSheet.hairlineWidth;
