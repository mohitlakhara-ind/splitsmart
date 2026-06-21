import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Radii, Shadows } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline' | 'accent';
  padding?: number;
}

/**
 * GlassCard — Splitwiser's signature glassmorphism card component
 * Reads from theme colors to support dark/light modes dynamically.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 16,
}) => {
  const theme = useTheme();
  const customColors = (theme.colors as any).custom;

  const styles = StyleSheet.create({
    base: {
      borderRadius: Radii.lg,
      overflow: 'hidden',
    },
    cardDefault: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      ...Shadows.card,
      shadowColor: customColors.cardShadow,
    },
    cardElevated: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: customColors.glassBorder,
      ...Shadows.glow,
      shadowColor: theme.colors.primary,
    },
    cardOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: customColors.primaryLight,
    },
    cardAccent: {
      backgroundColor: customColors.glassStrong,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      ...Shadows.glow,
      shadowColor: theme.colors.primary,
    },
  });

  const variantStyles = {
    default: styles.cardDefault,
    elevated: styles.cardElevated,
    outline: styles.cardOutline,
    accent: styles.cardAccent,
  };

  return (
    <View style={[styles.base, variantStyles[variant], { padding }, style]}>
      {children}
    </View>
  );
};

export default GlassCard;
