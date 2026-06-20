import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { DefaultTheme as NavLightTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';

export const LightColors = {
  // Brand Core
  primary: '#10B981',        // Emerald 500
  primaryLight: '#34D399',   // Emerald 400
  primaryDark: '#059669',    // Emerald 600
  accent: '#0F172A',         // Slate 900 (Navy)
  accentLight: '#1E293B',    // Slate 800
  accentGlow: 'rgba(16, 185, 129, 0.15)',

  // Backgrounds (Clean Light)
  bg: '#F8FAFC',             // Slate 50
  bgCard: '#FFFFFF',         // White
  bgCardBorder: '#E2E8F0',   // Slate 200
  bgSurface: '#F1F5F9',      // Slate 100
  bgInput: '#FFFFFF',

  // Semantic
  positive: '#10B981',       // Emerald for credit
  negative: '#EF4444',       // Red for debt
  warning: '#F59E0B',        // Amber for pending
  muted: '#64748B',          // Slate 500

  // Text
  textPrimary: '#0F172A',    // Slate 900
  textSecondary: '#475569',  // Slate 600
  textMuted: '#64748B',      // Slate 500
  textInverse: '#FFFFFF',    // White text on dark elements

  // Gradients (as arrays for LinearGradient)
  gradPrimary: ['#10B981', '#34D399'],
  gradCard: ['#FFFFFF', '#FFFFFF'],
  gradSplash: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],

  // Glassmorphism helpers (reduced for clean look)
  glass: 'rgba(255, 255, 255, 0.8)',
  glassBorder: '#E2E8F0',
  glassStrong: 'rgba(16, 185, 129, 0.1)',
  cardShadow: '#64748B',
};

export const DarkColors = {
  // Brand Core
  primary: '#10B981',        // Emerald 500
  primaryLight: '#34D399',   // Emerald 400
  primaryDark: '#059669',    // Emerald 600
  accent: '#F8FAFC',         // Slate 50 (Navy)
  accentLight: '#E2E8F0',    // Slate 200
  accentGlow: 'rgba(16, 185, 129, 0.25)',

  // Backgrounds (Deep Dark)
  bg: '#020617',             // Slate 950
  bgCard: '#0F172A',         // Slate 900
  bgCardBorder: '#1E293B',   // Slate 800
  bgSurface: '#1E293B',      // Slate 800
  bgInput: '#0F172A',

  // Semantic
  positive: '#10B981',       // Emerald for credit
  negative: '#EF4444',       // Red for debt
  warning: '#F59E0B',        // Amber for pending
  muted: '#94A3B8',          // Slate 400

  // Text
  textPrimary: '#F8FAFC',    // Slate 50
  textSecondary: '#E2E8F0',  // Slate 200
  textMuted: '#94A3B8',      // Slate 400
  textInverse: '#0F172A',    // Dark text on white/light elements

  // Gradients (as arrays for LinearGradient)
  gradPrimary: ['#10B981', '#059669'],
  gradCard: ['#0F172A', '#0F172A'],
  gradSplash: ['#020617', '#0F172A', '#1E293B'],

  // Glassmorphism helpers (reduced for clean look)
  glass: 'rgba(15, 23, 42, 0.8)',
  glassBorder: '#1E293B',
  glassStrong: 'rgba(16, 185, 129, 0.15)',
  cardShadow: '#000000',
};

// Export Colors for legacy static imports (defaulting to LightColors)
export const Colors = LightColors;

export const Typography = {
  fontFamily: {
    // Falls back to system fonts on Android/iOS since custom font files aren't pre-loaded,
    // but defines style weights nicely
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    display: 38,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 56,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fab: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const AppPaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: LightColors.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: 'rgba(16, 185, 129, 0.15)',
    onPrimaryContainer: LightColors.primaryDark,
    secondary: LightColors.accent,
    onSecondary: '#FFFFFF',
    background: LightColors.bg,
    onBackground: LightColors.textPrimary,
    surface: LightColors.bgCard,
    onSurface: LightColors.textPrimary,
    surfaceVariant: LightColors.bgSurface,
    onSurfaceVariant: LightColors.textSecondary,
    outline: LightColors.bgCardBorder,
    error: LightColors.negative,
    onError: '#FFFFFF',
    custom: LightColors,
  },
};

export const AppPaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: DarkColors.primary,
    onPrimary: '#FFFFFF',
    primaryContainer: 'rgba(16, 185, 129, 0.25)',
    onPrimaryContainer: DarkColors.primaryLight,
    secondary: DarkColors.accent,
    onSecondary: '#0F172A',
    background: DarkColors.bg,
    onBackground: DarkColors.textPrimary,
    surface: DarkColors.bgCard,
    onSurface: DarkColors.textPrimary,
    surfaceVariant: DarkColors.bgSurface,
    onSurfaceVariant: DarkColors.textSecondary,
    outline: DarkColors.bgCardBorder,
    error: DarkColors.negative,
    onError: '#FFFFFF',
    custom: DarkColors,
  },
};

export const AppNavLightTheme = {
  ...NavLightTheme,
  dark: false,
  colors: {
    ...NavLightTheme.colors,
    primary: LightColors.primary,
    background: LightColors.bg,
    card: LightColors.bgCard,
    text: LightColors.textPrimary,
    border: LightColors.bgCardBorder,
    notification: LightColors.primary,
  },
};

export const AppNavDarkTheme = {
  ...NavDarkTheme,
  dark: true,
  colors: {
    ...NavDarkTheme.colors,
    primary: DarkColors.primary,
    background: DarkColors.bg,
    card: DarkColors.bgCard,
    text: DarkColors.textPrimary,
    border: DarkColors.bgCardBorder,
    notification: DarkColors.primary,
  },
};
