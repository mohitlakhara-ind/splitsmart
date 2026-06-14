// SplitSmart Design System — Dark Violet + Electric Cyan Glassmorphism
// Author: Mohit Lakhara

export const Colors = {
  // Brand Core
  primary: '#7C3AED',        // Violet 600
  primaryLight: '#A78BFA',   // Violet 400
  primaryDark: '#5B21B6',    // Violet 700
  accent: '#06B6D4',         // Cyan 500
  accentLight: '#67E8F9',    // Cyan 300
  accentGlow: 'rgba(6, 182, 212, 0.25)',

  // Backgrounds (dark glassmorphism)
  bg: '#0D0A1E',             // Deep space bg
  bgCard: 'rgba(30, 20, 60, 0.75)',
  bgCardBorder: 'rgba(124, 58, 237, 0.3)',
  bgSurface: '#160E30',
  bgInput: 'rgba(255,255,255,0.06)',

  // Semantic
  positive: '#10B981',       // Emerald for credit
  negative: '#F43F5E',       // Rose for debt
  warning: '#F59E0B',        // Amber for pending
  muted: '#6B7280',

  // Text
  textPrimary: '#F5F3FF',
  textSecondary: '#C4B5FD',
  textMuted: '#7C6FAD',
  textInverse: '#0D0A1E',

  // Gradients (as arrays for LinearGradient)
  gradPrimary: ['#7C3AED', '#06B6D4'],
  gradCard: ['rgba(30,20,60,0.9)', 'rgba(16,10,40,0.7)'],
  gradSplash: ['#0D0A1E', '#160E30', '#1A0A3D'],

  // Glassmorphism helpers
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassStrong: 'rgba(124, 58, 237, 0.15)',
};

export const Typography = {
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
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
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  glow: {
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 16,
  },
};
