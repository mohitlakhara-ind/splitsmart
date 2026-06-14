import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Shadows } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline' | 'accent';
  padding?: number;
}

/**
 * GlassCard — SplitSmart's signature glassmorphism card component
 * Uses layered semi-transparent backgrounds with violet border glow
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 16,
}) => {
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

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  cardDefault: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.bgCardBorder,
    ...Shadows.card,
  },
  cardElevated: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...Shadows.glow,
  },
  cardOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
  },
  cardAccent: {
    backgroundColor: Colors.glassStrong,
    borderWidth: 1,
    borderColor: Colors.accent,
    ...Shadows.glow,
  },
});

export default GlassCard;
