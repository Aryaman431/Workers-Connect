import { TextStyle, ViewStyle } from 'react-native';

/**
 * Worker Connect design system.
 * Every screen/component in the app should import colors, spacing, radius,
 * typography, shadows, and icon sizes from here — no magic hex values elsewhere.
 */

export const colors = {
  bg: '#F4F1E8',
  surface: '#FDFCF8',
  white: '#FFFFFF',
  border: '#E3DED2',
  chipBg: '#EEEAE0',
  muted: '#6A6D71',
  dark: '#1B2027',
  darkSurface: '#232A31',
  darkMuted: '#98A1A9',
  navy: '#1D3547',
  primary: '#1A6478',
  primaryDark: '#11495A',
  accent: '#C06B3E',
  accentSoft: '#F2E3D7',
  success: '#3E7C57',
  successSoft: '#E4EDE5',
  warning: '#B9862F',
  danger: '#B04A42',
  ivory: '#FBF9F3',
  ink: '#12161B',
  textileBlue: '#55808F',
  sage: '#7D9B86',
  primarySoft: '#E7EFF1',
  warningSoft: '#F5EBD7',
  warningInk: '#8A6216',
} as const;

/**
 * Translucent surfaces consumed by `GlassSurface`.
 * The rgba strings live here (not inside components) so the glass language is
 * defined in exactly one place.
 */
export const glass = {
  fill: 'rgba(253,252,248,0.72)',
  fillStrong: 'rgba(253,252,248,0.90)',
  border: 'rgba(255,255,255,0.70)',
  hairline: 'rgba(27,32,39,0.08)',
  darkFill: 'rgba(29,53,71,0.72)',
  darkBorder: 'rgba(255,255,255,0.22)',
  intensity: 26,
  intensityHigh: 45,
  tint: 'light',
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
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
} as const;

type TypographyVariant = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing: number;
};

export const typography: Record<
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'label' | 'caption' | 'kicker' | 'stat',
  TypographyVariant
> = {
  display: { fontSize: 34, fontWeight: '800', lineHeight: 40, letterSpacing: 1.2 },
  h1: { fontSize: 28, fontWeight: '800', lineHeight: 36, letterSpacing: 0.2 },
  h2: { fontSize: 22, fontWeight: '700', lineHeight: 29, letterSpacing: 0.2 },
  h3: { fontSize: 18, fontWeight: '700', lineHeight: 25, letterSpacing: 0.2 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24, letterSpacing: 0.1 },
  bodyBold: { fontSize: 16, fontWeight: '700', lineHeight: 24, letterSpacing: 0.1 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.3 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0.2 },
  kicker: { fontSize: 11, fontWeight: '800', lineHeight: 16, letterSpacing: 1.6 },
  stat: { fontSize: 20, fontWeight: '800', lineHeight: 26, letterSpacing: 0.1 },
};

/** Shared shadow colour for every elevation in the system. */
const shadowColor = colors.dark;

export const shadows: Record<'card' | 'elevated' | 'floating', ViewStyle> = {
  card: {
    shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  elevated: {
    shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
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

export const theme = { colors, spacing, radius, typography, shadows, iconSizes, tints, glass };

export default theme;
