import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radii } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BalanceBarProps {
  totalOwed: number;    // amount you owe others (negative)
  totalOwing: number;   // amount others owe you (positive)
  currency?: string;
}

/**
 * AnimatedBalanceBar — Visual balance indicator showing net position
 * Green bar = you're owed money | Red bar = you owe money
 */
export const AnimatedBalanceBar: React.FC<BalanceBarProps> = ({
  totalOwed,
  totalOwing,
  currency = '₹',
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const net = totalOwing - totalOwed;
  const max = Math.max(totalOwed, totalOwing, 1);
  const owedRatio = totalOwed / max;
  const owingRatio = totalOwing / max;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [totalOwed, totalOwing]);

  const owedWidth = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${owedRatio * 100}%`],
  });
  const owingWidth = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${owingRatio * 100}%`],
  });

  return (
    <View style={styles.container}>
      {/* Net Balance */}
      <View style={styles.netRow}>
        <Text style={styles.label}>Net Balance</Text>
        <Text
          style={[
            styles.netAmount,
            { color: net >= 0 ? Colors.positive : Colors.negative },
          ]}
        >
          {net >= 0 ? '+' : ''}{currency}{Math.abs(net).toFixed(2)}
        </Text>
      </View>

      {/* Bar tracks */}
      <View style={styles.barContainer}>
        {/* You owe (red, left side) */}
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              styles.barOwed,
              { width: owedWidth },
            ]}
          />
        </View>

        {/* Center divider */}
        <View style={styles.divider} />

        {/* You're owed (green, right side) */}
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              styles.barOwing,
              { width: owingWidth },
            ]}
          />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.negative }]} />
          <Text style={styles.legendText}>You owe {currency}{totalOwed.toFixed(2)}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.positive }]} />
          <Text style={styles.legendText}>Owed to you {currency}{totalOwing.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  netAmount: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamily.bold,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 10,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radii.full,
  },
  barOwed: {
    backgroundColor: Colors.negative,
    alignSelf: 'flex-end',
    shadowColor: Colors.negative,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  barOwing: {
    backgroundColor: Colors.positive,
    shadowColor: Colors.positive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  divider: {
    width: 2,
    height: 18,
    backgroundColor: Colors.textMuted,
    borderRadius: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
});
