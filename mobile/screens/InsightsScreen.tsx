import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Typography, Spacing, Radii, Shadows } from '../theme/colors';
import GlassCard from '../components/GlassCard';

const BAR_MAX_HEIGHT = 140;

interface CategorySpend {
  category: string;
  amount: number;
  colorKey: 'accent' | 'primary' | 'warning' | 'positive' | 'negative';
  icon: string;
}

interface MemberSpend {
  name: string;
  initials: string;
  total: number;
  percent: number;
}

const CATEGORIES_DEF: CategorySpend[] = [
  { category: 'Food', amount: 3200, colorKey: 'accent', icon: '🍔' },
  { category: 'Transport', amount: 1800, colorKey: 'primary', icon: '🚗' },
  { category: 'Shopping', amount: 2600, colorKey: 'warning', icon: '🛍️' },
  { category: 'Entertainment', amount: 1400, colorKey: 'positive', icon: '🎬' },
  { category: 'Utilities', amount: 900, colorKey: 'negative', icon: '⚡' },
];

const MOCK_MEMBERS: MemberSpend[] = [
  { name: 'You', initials: 'ML', total: 4800, percent: 48 },
  { name: 'Rahul', initials: 'RK', total: 3200, percent: 32 },
  { name: 'Priya', initials: 'PS', total: 2000, percent: 20 },
];

const InsightsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const customColors = (theme.colors as any).custom;

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return CATEGORIES_DEF.map(cat => ({
      ...cat,
      color: customColors[cat.colorKey] || theme.colors.primary,
    }));
  }, [customColors, theme]);

  const totalSpend = useMemo(() => categories.reduce((sum, c) => sum + c.amount, 0), [categories]);
  const maxAmount = useMemo(() => Math.max(...categories.map(c => c.amount)), [categories]);

  const periods = ['week', 'month', 'year'] as const;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingBottom: Spacing.md,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: Radii.full,
      backgroundColor: customColors.glass,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: customColors.glassBorder,
    },
    backIcon: { fontSize: 20, color: theme.colors.onBackground },
    title: {
      fontSize: Typography.sizes.xl,
      fontFamily: Typography.fontFamily.bold,
      fontWeight: '700',
      color: theme.colors.onBackground,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: Radii.lg,
      padding: 4,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    periodBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: Radii.md,
      alignItems: 'center',
    },
    periodBtnActive: {
      backgroundColor: theme.colors.primary,
      ...Shadows.card,
      shadowColor: theme.colors.primary,
    },
    periodText: {
      fontSize: Typography.sizes.sm,
      fontFamily: Typography.fontFamily.medium,
      color: customColors.textMuted,
      fontWeight: '600',
    },
    periodTextActive: {
      color: '#FFFFFF',
    },
    totalCard: {
      marginBottom: Spacing.md,
    },
    totalLabel: {
      fontSize: Typography.sizes.xs,
      color: customColors.textMuted,
      fontFamily: Typography.fontFamily.medium,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    totalAmount: {
      fontSize: Typography.sizes.xxl,
      fontFamily: Typography.fontFamily.bold,
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    totalSubRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalSub: {
      fontSize: Typography.sizes.xs,
      color: customColors.textMuted,
      fontFamily: Typography.fontFamily.regular,
    },
    trendBadge: {
      backgroundColor: theme.dark ? 'rgba(16,185,129,0.15)' : '#e8f5e8',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: Radii.full,
      borderWidth: 1,
      borderColor: customColors.positive,
    },
    trendText: {
      fontSize: Typography.sizes.xs,
      color: customColors.positive,
      fontFamily: Typography.fontFamily.medium,
      fontWeight: '600',
    },
    chartCard: {
      marginBottom: Spacing.md,
      paddingBottom: Spacing.sm,
    },
    sectionTitle: {
      fontSize: Typography.sizes.md,
      fontFamily: Typography.fontFamily.semiBold,
      color: theme.colors.onSurface,
      marginBottom: Spacing.md,
      fontWeight: '700',
    },
    barChart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: BAR_MAX_HEIGHT + 60,
      paddingHorizontal: Spacing.sm,
    },
    barColumn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 4,
    },
    barLabel: {
      backgroundColor: theme.colors.surface,
      borderRadius: Radii.sm,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      marginBottom: 4,
      ...Shadows.card,
      shadowColor: customColors.cardShadow,
    },
    barLabelText: {
      fontSize: 10,
      color: theme.colors.onSurface,
      fontFamily: Typography.fontFamily.bold,
    },
    bar: {
      width: 28,
      borderRadius: Radii.sm,
      elevation: 4,
    },
    barIcon: {
      fontSize: 16,
      marginTop: 4,
    },
    barCategory: {
      fontSize: 9,
      color: customColors.textMuted,
      fontFamily: Typography.fontFamily.medium,
      textAlign: 'center',
    },
    xAxis: {
      height: 1,
      backgroundColor: theme.colors.outline,
      marginHorizontal: Spacing.sm,
      marginTop: 4,
    },
    categoryList: {
      gap: 8,
      marginBottom: Spacing.md,
    },
    catItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    catLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    catDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    catIcon: { fontSize: 18 },
    catName: {
      fontSize: Typography.sizes.sm,
      color: customColors.textSecondary,
      fontFamily: Typography.fontFamily.medium,
    },
    catRight: {
      alignItems: 'flex-end',
    },
    catAmount: {
      fontSize: Typography.sizes.sm,
      color: theme.colors.onSurface,
      fontFamily: Typography.fontFamily.semiBold,
      fontWeight: '600',
    },
    catPct: {
      fontSize: Typography.sizes.xs,
      color: customColors.textMuted,
      fontFamily: Typography.fontFamily.regular,
    },
    memberCard: {
      gap: Spacing.md,
    },
    memberRow: {
      flexDirection: 'row',
      gap: Spacing.md,
      alignItems: 'center',
      marginBottom: 12,
    },
    memberAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: customColors.glassStrong,
      borderWidth: 2,
      borderColor: customColors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    memberInitials: {
      fontSize: Typography.sizes.sm,
      color: theme.colors.primary,
      fontFamily: Typography.fontFamily.bold,
      fontWeight: '700',
    },
    memberInfo: {
      flex: 1,
      gap: 4,
    },
    memberNameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    memberName: {
      fontSize: Typography.sizes.sm,
      color: theme.colors.onSurface,
      fontFamily: Typography.fontFamily.semiBold,
      fontWeight: '600',
    },
    memberAmount: {
      fontSize: Typography.sizes.sm,
      color: customColors.textSecondary,
      fontFamily: Typography.fontFamily.medium,
    },
    memberBarTrack: {
      height: 6,
      backgroundColor: theme.colors.outline,
      borderRadius: Radii.full,
      overflow: 'hidden',
      marginTop: 4,
    },
    memberBarFill: {
      height: '100%',
      borderRadius: Radii.full,
    },
    memberPct: {
      fontSize: Typography.sizes.xs,
      color: customColors.textMuted,
      fontFamily: Typography.fontFamily.regular,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Insights</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.periodSelector}>
          {periods.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, selectedPeriod === p && styles.periodBtnActive]}
              onPress={() => setSelectedPeriod(p)}
            >
              <Text style={[styles.periodText, selectedPeriod === p && styles.periodTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassCard style={styles.totalCard} variant="elevated">
          <Text style={styles.totalLabel}>Total Group Spend ({selectedPeriod})</Text>
          <Text style={styles.totalAmount}>₹{totalSpend.toLocaleString('en-IN')}</Text>
          <View style={styles.totalSubRow}>
            <Text style={styles.totalSub}>across {categories.length} categories</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>↓ 12% vs last {selectedPeriod}</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.chartCard} variant="default">
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <View style={styles.barChart}>
            {categories.map((cat) => {
              const barHeight = (cat.amount / maxAmount) * BAR_MAX_HEIGHT;
              const isActive = activeCategory === cat.category;
              return (
                <TouchableOpacity
                  key={cat.category}
                  style={styles.barColumn}
                  onPress={() =>
                    setActiveCategory(isActive ? null : cat.category)
                  }
                >
                  {isActive && (
                    <View style={styles.barLabel}>
                      <Text style={styles.barLabelText}>
                        ₹{(cat.amount / 1000).toFixed(1)}k
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: cat.color,
                        opacity: isActive ? 1 : 0.75,
                        shadowColor: cat.color,
                        shadowOpacity: isActive ? 0.8 : 0.3,
                        shadowRadius: isActive ? 10 : 4,
                        shadowOffset: { width: 0, height: 0 },
                      },
                    ]}
                  />
                  <Text style={styles.barIcon}>{cat.icon}</Text>
                  <Text style={styles.barCategory} numberOfLines={1}>
                    {cat.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.xAxis} />
        </GlassCard>

        <View style={styles.categoryList}>
          {categories.map((cat) => {
            const pct = ((cat.amount / totalSpend) * 100).toFixed(1);
            return (
              <GlassCard key={cat.category} style={styles.catItem} padding={12}>
                <View style={styles.catLeft}>
                  <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={styles.catName}>{cat.category}</Text>
                </View>
                <View style={styles.catRight}>
                  <Text style={styles.catAmount}>₹{cat.amount.toLocaleString('en-IN')}</Text>
                  <Text style={styles.catPct}>{pct}%</Text>
                </View>
              </GlassCard>
            );
          })}
        </View>

        <GlassCard style={styles.memberCard} variant="default">
          <Text style={styles.sectionTitle}>Who Spent the Most?</Text>
          {MOCK_MEMBERS.map((member) => (
            <View key={member.name} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitials}>{member.initials}</Text>
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberAmount}>₹{member.total.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.memberBarTrack}>
                  <View
                    style={[
                      styles.memberBarFill,
                      { width: `${member.percent}%`, backgroundColor: theme.colors.primary },
                    ]}
                  />
                </View>
                <Text style={styles.memberPct}>{member.percent}% of total</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

export default InsightsScreen;
