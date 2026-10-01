import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * Worker Connect design system.
 * Every screen/component in the app should import colors, spacing, radius,
 * typography, shadows, and icon sizes from here — no magic hex values elsewhere.
 */

export const colors = {
  bg: '#F7F5F0',
  surface: '#FFFFFF',
  dark: '#17212B',
  navy: '#12344D',
  primary: '#176B87',
  primaryDark: '#124F63',
  accent: '#D97745',
  accentSoft: '#F6E5DA',
  success: '#2F8F5B',
  successSoft: '#E3F1E9',
  warning: '#D89A35',
  danger: '#C95757',
  muted: '#6B7280',
  border: '#E4E1DA',
  white: '#FFFFFF',
  chipBg: '#EFEBE3',
  darkSurface: '#1E2A35',
  darkMuted: '#8B98A5',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

type TypographyVariant = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing: number;
};

export const typography: Record<
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'label' | 'caption',
  TypographyVariant
> = {
  display: { fontSize: 38, fontWeight: '800', lineHeight: 44, letterSpacing: 1.5 },
  h1: { fontSize: 30, fontWeight: '800', lineHeight: 38, letterSpacing: 0.2 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 31, letterSpacing: 0.2 },
  h3: { fontSize: 19, fontWeight: '700', lineHeight: 26, letterSpacing: 0.2 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0.1 },
  bodyBold: { fontSize: 16, fontWeight: '700', lineHeight: 24, letterSpacing: 0.1 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.3 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0.2 },
};

const shadowBase: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#17212B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 2 },
  default: {},
}) as ViewStyle;

export const shadows: Record<'card' | 'elevated' | 'floating', ViewStyle> = {
  card: { ...shadowBase },
  elevated: {
    ...shadowBase,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
  },
  floating: {
    ...shadowBase,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 9,
  },
};

export const iconSizes = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 48,
  hero: 72,
} as const;

/** Full-bleed absolute fill (RN 0.86 dropped `StyleSheet.absoluteFillObject`). */
export const absoluteFill: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/** Derived tint family used for skill chips, avatars, and pattern accents. */
export const tints = {
  primary: colors.primary,
  accent: colors.accent,
  success: colors.success,
  warning: colors.warning,
  navy: colors.navy,
} as const;

export const theme = { colors, spacing, radius, typography, shadows, iconSizes, tints };

export default theme;
