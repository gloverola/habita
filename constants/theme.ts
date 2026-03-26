import { Platform } from 'react-native';

export const theme = {
  colors: {
    white:       '#FFFFFF',
    ink:         '#0A0A0A',
    gray50:      '#FAFAFA',
    gray100:     '#F5F5F5',
    gray200:     '#EBEBEB',
    gray300:     '#D4D4D4',
    gray400:     '#A3A3A3',
    gray500:     '#737373',
    background:  '#FAFAFA',
    surface:     '#FFFFFF',
    border:      '#EBEBEB',
    muted:       '#737373',
    placeholder: '#A3A3A3',
    cellDone:    '#0A0A0A',
    cellSkipped: '#FFFFFF',
    cellEmpty:   '#F5F5F5',
    cellFuture:  '#FAFAFA',
    danger:      '#DC2626',
  },
  spacing: { xxs: 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radii:   { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  dayCell: { size: 36, gap: 4, borderRadius: 8 },
  typography: {
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 32 },
    weights: {
      regular: '400' as const,
      medium:  '500' as const,
      semibold:'600' as const,
      bold:    '700' as const,
    },
    lineHeights: { tight: 1.2, normal: 1.4, loose: 1.6 },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
  },
};

// Legacy Colors export for any remaining usages
export const Colors = {
  light: {
    text: theme.colors.ink,
    background: theme.colors.background,
    tint: theme.colors.ink,
    icon: theme.colors.gray500,
    tabIconDefault: theme.colors.gray400,
    tabIconSelected: theme.colors.ink,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
