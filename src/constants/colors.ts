export const colors = {
  background: '#FDFFFB',
  surface: '#FFFFFF',
  /** One neutral fill covers the back button, progress track, slider and disabled buttons. */

  surfaceMuted: '#F2F2F7',
  text: '#000000',
  textMuted: '#898A8D',
  border: '#E7E0D8',
  accent: '#34C759',
  accentMuted: '#E3F8EA',
  disabledText: '#D1D1D7',
  overlay: 'rgba(28, 25, 23, 0.4)',
  star: '#C8962E',
  danger: '#B42318',
  splash: '#FDFFFB',
} as const;

export const amountGradient = {
  colors: ['#1A1A1A', '#2A5C37', '#38904D', '#4FC46D', '#2F6B3E', '#1A1A1A', '#1A1A1A'],
  locations: [0, 0.1, 0.22, 0.32, 0.48, 0.62, 1],
} as const;
