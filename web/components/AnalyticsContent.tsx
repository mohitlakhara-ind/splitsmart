import { Calendar, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import React from 'react';
import {
    Area,
    AreaChart,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { GroupAnalytics } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';

interface AnalyticsContentProps {
    analytics: GroupAnalytics | null;
    groupCurrency: string;
    timeframe: 'month' | '6months' | 'year';
    onTimeframeChange: (timeframe: 'month' | '6months' | 'year') => void;
    selectedYear: number;
    selectedMonth: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
}

export const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
    analytics,
    groupCurrency,
    timeframe,
    onTimeframeChange,
    selectedYear,
    selectedMonth,
    onYearChange,
    onMonthChange
}) => {
    // Generate year options (last 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Month options
    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    if (!analytics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <>
            {/* Timeframe Filter */}
            <div className="p-6 bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-sm border border-[var(--color-fintech-border)]">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[var(--color-fintech-text-muted)]">
                        <Calendar size={20} className="opacity-80" />
                        <span className="font-semibold text-[var(--color-fintech-text)]">Select Timeframe:</span>
                    </div>

                    {/* Timeframe Type Selector */}
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={() => onTimeframeChange('month')}
                            variant={timeframe === 'month' ? 'primary' : 'secondary'}
                            className={`px-4 py-2 text-sm ${timeframe === 'month' ? '' : 'opacity-70 hover:opacity-100 bg-[var(--color-fintech-bg-alt)]'}`}
                        >
                            Specific Month
                        </Button>
                        <Button
                            onClick={() => onTimeframeChange('6months')}
                            variant={timeframe === '6months' ? 'primary' : 'secondary'}
                            className={`px-4 py-2 text-sm ${timeframe === '6months' ? '' : 'opacity-70 hover:opacity-100 bg-[var(--color-fintech-bg-alt)]'}`}
                        >
                            Last 6 Months
                        </Button>
                        <Button
                            onClick={() => onTimeframeChange('year')}
                            variant={timeframe === 'year' ? 'primary' : 'secondary'}
                            className={`px-4 py-2 text-sm ${timeframe === 'year' ? '' : 'opacity-70 hover:opacity-100 bg-[var(--color-fintech-bg-alt)]'}`}
                        >
                            Specific Year
                        </Button>
                    </div>

                    {/* Date Selectors */}
                    <div className="flex gap-3 flex-wrap items-center">
                        {timeframe === 'month' && (
                            <>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => onMonthChange(Number(e.target.value))}
                                    className="px-4 py-2.5 rounded-xl border border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-text)] font-medium shadow-sm outline-none focus:border-[var(--color-fintech-primary)] focus:ring-2 focus:ring-[var(--color-fintech-primary)]/20 transition-all"
                                >
                                    {monthOptions.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => onYearChange(Number(e.target.value))}
                                    className="px-4 py-2.5 rounded-xl border border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-text)] font-medium shadow-sm outline-none focus:border-[var(--color-fintech-primary)] focus:ring-2 focus:ring-[var(--color-fintech-primary)]/20 transition-all"
                                >
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {timeframe === 'year' && (
                            <select
                                value={selectedYear}
                                onChange={(e) => onYearChange(Number(e.target.value))}
                                className="px-4 py-2.5 rounded-xl border border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-text)] font-medium shadow-sm outline-none focus:border-[var(--color-fintech-primary)] focus:ring-2 focus:ring-[var(--color-fintech-primary)]/20 transition-all"
                            >
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        )}

                        {timeframe === '6months' && (
                            <p className="text-sm font-medium text-[var(--color-fintech-text-muted)] bg-[var(--color-fintech-bg)] px-4 py-2.5 rounded-xl border border-[var(--color-fintech-border)]">
                                Showing last 6 months from today
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 text-center bg-[var(--color-fintech-bg-alt)] rounded-2xl shadow-sm border border-[var(--color-fintech-border)]">
                    <p className="text-xs font-semibold text-[var(--color-fintech-text-muted)] uppercase tracking-wider mb-2">Total Expenses</p>
                    <p className="text-3xl font-display font-bold text-[var(--color-fintech-text)]">{formatCurrency(analytics.totalExpenses, groupCurrency)}</p>
                    <p className="text-xs text-[var(--color-fintech-text-muted)] mt-1 font-medium">{analytics.expenseCount} transactions</p>
                </div>
                <div className="p-6 text-center bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Average Expense</p>
                    <p className="text-3xl font-display font-bold text-blue-700">{formatCurrency(analytics.avgExpenseAmount, groupCurrency)}</p>
                </div>
                <div className="p-6 text-center bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">Period</p>
                    <p className="text-2xl font-display font-bold text-purple-700">{analytics.period}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending by Category - Pie Chart */}
                <div className="p-6 bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-sm border border-[var(--color-fintech-border)]">
                    <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-[var(--color-fintech-text)]">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-fintech-primary)]/10 flex items-center justify-center text-[var(--color-fintech-primary)]">
                            <PieChartIcon size={16} />
                        </div>
                        Spending by Category
                    </h3>
                    {analytics.topCategories.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.topCategories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="amount"
                                        nameKey="category"
                                        stroke="white"
                                        strokeWidth={2}
                                    >
                                        {analytics.topCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'][index % 8]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value, groupCurrency)}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            fontWeight: 500
                                        }}
                                    />
                                    <Legend
                                        formatter={(value, entry: any) => `${value} (${entry.payload.count})`}
                                        wrapperStyle={{ fontSize: '13px', fontWeight: 500 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center opacity-50 bg-[var(--color-fintech-bg)] rounded-2xl border border-dashed border-[var(--color-fintech-border)]">
                            <p className="font-medium text-[var(--color-fintech-text-muted)]">No category data available</p>
                        </div>
                    )}
                </div>

                {/* Spending Trends - Area Chart */}
                <div className="p-6 bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-sm border border-[var(--color-fintech-border)]">
                    <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-[var(--color-fintech-text)]">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-fintech-primary)]/10 flex items-center justify-center text-[var(--color-fintech-primary)]">
                            <TrendingUp size={16} />
                        </div>
                        Spending Trends
                    </h3>
                    {analytics.expenseTrends.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.expenseTrends}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => new Date(value).getDate().toString()}
                                    />
                                    <YAxis
                                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value, groupCurrency), 'Amount']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            fontWeight: 500
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#0d9488"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center opacity-50 bg-[var(--color-fintech-bg)] rounded-2xl border border-dashed border-[var(--color-fintech-border)]">
                            <p className="font-medium text-[var(--color-fintech-text-muted)]">No trend data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Member Contributions Timeline */}
            <div className="p-6 bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-sm border border-[var(--color-fintech-border)]">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-[var(--color-fintech-text)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-fintech-primary)]/10 flex items-center justify-center text-[var(--color-fintech-primary)]">
                        <TrendingUp size={16} />
                    </div>
                    Member Contributions Over Time
                </h3>
                {analytics.contributionTimeline && analytics.contributionTimeline.length > 0 ? (
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.contributionTimeline}>
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return `${date.getMonth() + 1}/${date.getDate()}`;
                                    }}
                                />
                                <YAxis
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${groupCurrency} ${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => [formatCurrency(value, groupCurrency), name]}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        fontWeight: 500
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 500, paddingTop: '16px' }} />

                                {/* Total Expenses Line - Thicker and distinct */}
                                <Line
                                    type="monotone"
                                    dataKey="Total Expenses"
                                    stroke="#0f172a"
                                    strokeWidth={4}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />

                                {/* Individual Member Lines */}
                                {analytics.memberContributions.map((member, idx) => {
                                    const colors = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];
                                    const color = colors[idx % colors.length];
                                    return (
                                        <Line
                                            key={member.userName}
                                            type="monotone"
                                            dataKey={member.userName}
                                            stroke={color}
                                            strokeWidth={2.5}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                        />
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[400px] flex items-center justify-center opacity-50 bg-[var(--color-fintech-bg)] rounded-2xl border border-dashed border-[var(--color-fintech-border)]">
                        <p className="font-medium text-[var(--color-fintech-text-muted)]">No member contribution data available</p>
                    </div>
                )}
            </div>
        </>
    );
};
