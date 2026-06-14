import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme/colors';
import GlassCard from '../components/GlassCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 140;

// Feature: Expense Insights Dashboard
// Shows monthly category-wise spending breakdown per group member
// Uses built-in animated bars (no external chart library needed)

interface CategorySpend {
  category: string;
  amount: number;
  color: string;
  icon: string;
}

interface MemberSpend {
  name: string;
  initials: string;
  total: number;
  percent: number;
}

const MOCK_CATEGORIES: CategorySpend[] = [
  { category: 'Food', amount: 3200, color: Colors.accent, icon: '🍔' },
  { category: 'Transport', amount: 1800, color: Colors.primary, icon: '🚗' },
  { category: 'Shopping', amount: 2600, color: Colors.warning, icon: '🛍️' },
  { category: 'Entertainment', amount: 1400, color: Colors.positive, icon: '🎬' },
  { category: 'Utilities', amount: 900, color: Colors.negative, icon: '⚡' },
];

const MOCK_MEMBERS: MemberSpend[] = [
  { name: 'You', initials: 'ML', total: 4800, percent: 48 },
  { name: 'Rahul', initials: 'RK', total: 3200, percent: 32 },
  { name: 'Priya', initials: 'PS', total: 2000, percent: 20 },
];

const InsightsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const totalSpend = MOCK_CATEGORIES.reduce((sum, c) => sum + c.amount, 0);
  const maxAmount = Math.max(...MOCK_CATEGORIES.map(c => c.amount));

  const periods = ['week', 'month', 'year'] as const;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Insights</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Period Selector */}
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

        {/* Total Spend Card */}
        <GlassCard style={styles.totalCard} variant="elevated">
          <Text style={styles.totalLabel}>Total Group Spend ({selectedPeriod})</Text>
          <Text style={styles.totalAmount}>₹{totalSpend.toLocaleString('en-IN')}</Text>
          <View style={styles.totalSubRow}>
            <Text style={styles.totalSub}>across {MOCK_CATEGORIES.length} categories</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>↓ 12% vs last {selectedPeriod}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Category Bar Chart */}
        <GlassCard style={styles.chartCard} variant="default">
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <View style={styles.barChart}>
            {MOCK_CATEGORIES.map((cat) => {
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
                  {/* Amount label on hover */}
                  {isActive && (
                    <View style={styles.barLabel}>
                      <Text style={styles.barLabelText}>
                        ₹{(cat.amount / 1000).toFixed(1)}k
                      </Text>
                    </View>
                  )}
                  {/* Bar */}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: cat.color,
                        opacity: isActive ? 1 : 0.7,
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
          {/* X-axis line */}
          <View style={styles.xAxis} />
        </GlassCard>

        {/* Category Pills Legend */}
        <View style={styles.categoryList}>
          {MOCK_CATEGORIES.map((cat) => {
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

        {/* Member Contribution */}
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
                      { width: `${member.percent}%`, backgroundColor: Colors.primary },
                    ]}
                  />
                </View>
                <Text style={styles.memberPct}>{member.percent}% of total</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
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
    backgroundColor: Colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  backIcon: { fontSize: 20, color: Colors.textPrimary },
  title: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSurface,
    borderRadius: Radii.lg,
    padding: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.card,
  },
  periodText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textMuted,
  },
  periodTextActive: {
    color: Colors.textPrimary,
  },
  totalCard: {
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  totalAmount: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  totalSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  trendBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.positive,
  },
  trendText: {
    fontSize: Typography.sizes.xs,
    color: Colors.positive,
    fontFamily: Typography.fontFamily.medium,
  },
  chartCard: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
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
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 4,
  },
  barLabelText: {
    fontSize: 10,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  bar: {
    width: 28,
    borderRadius: Radii.sm,
    elevation: 8,
  },
  barIcon: {
    fontSize: 16,
    marginTop: 4,
  },
  barCategory: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.medium,
    textAlign: 'center',
  },
  xAxis: {
    height: 1,
    backgroundColor: Colors.glassBorder,
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
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  catRight: {
    alignItems: 'flex-end',
  },
  catAmount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
  },
  catPct: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  memberCard: {
    gap: Spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glassStrong,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitials: {
    fontSize: Typography.sizes.sm,
    color: Colors.primaryLight,
    fontFamily: Typography.fontFamily.bold,
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
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.semiBold,
  },
  memberAmount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  memberBarTrack: {
    height: 6,
    backgroundColor: Colors.glass,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  memberBarFill: {
    height: '100%',
    borderRadius: Radii.full,
  },
  memberPct: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
});

export default InsightsScreen;
