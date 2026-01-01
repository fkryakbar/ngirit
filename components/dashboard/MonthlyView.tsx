'use client';

import { DollarSign, Receipt, PiggyBank, BarChart2, BarChart3, Flame, Heart, LineChart, PieChart } from 'lucide-react';
import { formatRupiah, MONTHS, type MonthlyStatsResponse } from '@/lib/api';
import { useChartColors } from '@/lib/useChartColors';
import { CATEGORY_CONFIG, getCategoryConfig } from '@/lib/categoryIcons';
import StatCard from './StatCard';
import BarChartCard from './BarChartCard';
import PieChartCard from './PieChartCard';
import MinMaxCard from './MinMaxCard';
import TransactionList from './TransactionList';

interface MonthlyViewProps {
    monthlyStats: MonthlyStatsResponse;
    selectedMonth: string;
    selectedYear: number;
    years: number[];
    onMonthChange: (month: string) => void;
    onYearChange: (year: number) => void;
}

export default function MonthlyView({
    monthlyStats,
    selectedMonth,
    selectedYear,
    years,
    onMonthChange,
    onYearChange
}: MonthlyViewProps) {
    const colors = useChartColors();

    const getDailyChartData = () => {
        if (!monthlyStats?.data || monthlyStats.data.length === 0) return null;

        const dailyData: Record<string, { income: number; expense: number; invest: number }> = {};

        monthlyStats.data.forEach(transaction => {
            let day: string;
            if (transaction.date.includes(' ')) {
                day = transaction.date.split(' ')[0].split('-')[0];
            } else {
                day = transaction.date.split('-')[2];
            }

            if (!dailyData[day]) {
                dailyData[day] = { income: 0, expense: 0, invest: 0 };
            }

            if (transaction.type === 'income') {
                dailyData[day].income += transaction.amount;
            } else if (transaction.type === 'expense') {
                dailyData[day].expense += transaction.amount;
            } else if (transaction.type === 'invest') {
                dailyData[day].invest += transaction.amount;
            }
        });

        const sortedDays = Object.keys(dailyData).sort((a, b) => parseInt(a) - parseInt(b));

        return {
            labels: sortedDays.map(day => `${day}`),
            datasets: [
                {
                    label: 'Pemasukan',
                    data: sortedDays.map(day => dailyData[day].income),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Pengeluaran',
                    data: sortedDays.map(day => dailyData[day].expense),
                    backgroundColor: colors.expenseBg,
                    borderColor: colors.expenseBorder,
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Investasi',
                    data: sortedDays.map(day => dailyData[day].invest),
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: colors.legendColor,
                    font: { size: 11, weight: 'bold' as const }
                }
            },
            tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: colors.tooltipTitleColor,
                bodyColor: colors.tooltipBodyColor,
                titleFont: { size: 12 },
                bodyFont: { size: 11 },
                padding: 10,
                cornerRadius: 6,
                borderColor: 'rgba(16,185,129,0.2)',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                ticks: { color: colors.tickColor, font: { size: 10 } },
                grid: { color: colors.gridColor }
            },
            y: {
                ticks: { color: colors.tickColor, font: { size: 10 } },
                grid: { color: colors.gridColor }
            }
        }
    };

    // Function untuk mendapatkan data kategori (expense & invest saja)
    const getCategoryChartData = () => {
        if (!monthlyStats?.data || monthlyStats.data.length === 0) return null;

        // Filter hanya expense dan invest
        const filteredData = monthlyStats.data.filter(
            transaction => transaction.type === 'expense' || transaction.type === 'invest'
        );

        if (filteredData.length === 0) return null;

        // Aggregate by category
        const categoryData: Record<string, number> = {};

        filteredData.forEach(transaction => {
            const category = transaction.category || 'lainnya';
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += transaction.amount;
        });

        // Sort by amount descending
        const sortedCategories = Object.entries(categoryData)
            .sort((a, b) => b[1] - a[1]);

        const labels = sortedCategories.map(([category]) => getCategoryConfig(category).label);
        const data = sortedCategories.map(([, amount]) => amount);
        const backgroundColors = sortedCategories.map(([category]) => getCategoryConfig(category).color);
        const borderColors = sortedCategories.map(([category]) => getCategoryConfig(category).color);

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                }
            ]
        };
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: colors.legendColor,
                    font: { size: 10, weight: 'bold' as const },
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: colors.tooltipTitleColor,
                bodyColor: colors.tooltipBodyColor,
                titleFont: { size: 12 },
                bodyFont: { size: 11 },
                padding: 10,
                cornerRadius: 6,
                borderColor: 'rgba(16,185,129,0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function (context: { label?: string; parsed?: number; dataset?: { data?: number[] } }) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset?.data?.reduce((a: number, b: number) => a + b, 0) || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                        return `${label}: ${formatRupiah(value)} (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                color: '#ffffff',
                font: {
                    weight: 'bold' as const,
                    size: 11
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: (value: number, context: any) => {
                    const dataset = context.chart.data.datasets[0];
                    const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                    // Only show label if percentage >= 5%
                    return parseFloat(percentage) >= 5 ? `${percentage}%` : '';
                },
                anchor: 'center' as const,
                align: 'center' as const,
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowBlur: 4
            }
        }
    };

    const chartData = getDailyChartData();
    const categoryChartData = getCategoryChartData();

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Month/Year Selector */}
            <div className="flex justify-center gap-2 flex-wrap">
                <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="select-glass"
                >
                    {MONTHS.map(month => (
                        <option key={month.id} value={month.id}>{month.name}</option>
                    ))}
                </select>
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className="select-glass"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <StatCard
                    icon={DollarSign}
                    iconGradient="bg-linear-to-br from-green-400 to-emerald-600"
                    value={formatRupiah(monthlyStats.statistics.income.total)}
                    label={`Pemasukan (${monthlyStats.statistics.income.count}x)`}
                    valueColor="var(--income)"
                />
                <StatCard
                    icon={Receipt}
                    iconGradient="bg-linear-to-br from-red-400 to-rose-600"
                    value={formatRupiah(monthlyStats.statistics.expense.total)}
                    label={`Pengeluaran (${monthlyStats.statistics.expense.count}x)`}
                    valueColor="var(--expense)"
                />
                <StatCard
                    icon={LineChart}
                    iconGradient="bg-linear-to-br from-indigo-400 to-violet-600"
                    value={formatRupiah(monthlyStats.statistics.invest?.total || 0)}
                    label={`Investasi (${monthlyStats.statistics.invest?.count || 0}x)`}
                    valueColor="var(--invest)"
                />
                <StatCard
                    icon={BarChart2}
                    iconGradient="bg-linear-to-br from-blue-400 to-cyan-600"
                    value={formatRupiah(monthlyStats.statistics.overall.avg_expense)}
                    label="Rata-rata"
                />
                <StatCard
                    icon={PiggyBank}
                    iconGradient="bg-linear-to-br from-purple-400 to-fuchsia-600"
                    value={formatRupiah(monthlyStats.statistics.overall.total_income - monthlyStats.statistics.overall.total_expense - (monthlyStats.statistics.overall.total_invest || 0))}
                    label="Saldo"
                />
            </div>

            {/* Daily Chart */}
            {chartData && (
                <BarChartCard
                    title="Grafik Harian"
                    icon={BarChart3}
                    data={chartData}
                    options={chartOptions}
                />
            )}

            {/* Category Pie Chart */}
            {categoryChartData && (
                <PieChartCard
                    title="Distribusi Kategori (Expense & Investasi)"
                    icon={PieChart}
                    data={categoryChartData}
                    options={pieChartOptions}
                />
            )}

            {/* Min/Max Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {monthlyStats.statistics.expense.max && (
                    <MinMaxCard
                        title="Pengeluaran Terbesar"
                        icon={Flame}
                        iconColor="var(--expense)"
                        data={monthlyStats.statistics.expense.max}
                        valueColor="var(--expense)"
                    />
                )}
                {monthlyStats.statistics.expense.min && (
                    <MinMaxCard
                        title="Pengeluaran Terkecil"
                        icon={Heart}
                        iconColor="var(--income)"
                        data={monthlyStats.statistics.expense.min}
                        valueColor="var(--income)"
                    />
                )}
            </div>

            {/* Transaction List */}
            <TransactionList transactions={monthlyStats.data} />
        </div>
    );
}
