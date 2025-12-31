'use client';

import { TrendingUp, TrendingDown, PiggyBank, BarChart2, BarChart3, Flame, Heart, LineChart } from 'lucide-react';
import { formatRupiah, getMonthName, MONTHS, type YearlyStatsResponse } from '@/lib/api';
import { useChartColors } from '@/lib/useChartColors';
import StatCard from './StatCard';
import BarChartCard from './BarChartCard';
import MinMaxCard from './MinMaxCard';
import MonthlyBreakdown from './MonthlyBreakdown';

interface YearlyViewProps {
    yearlyStats: YearlyStatsResponse;
    selectedYear: number;
    years: number[];
    onYearChange: (year: number) => void;
    onMonthClick: (month: string) => void;
}

export default function YearlyView({
    yearlyStats,
    selectedYear,
    years,
    onYearChange,
    onMonthClick
}: YearlyViewProps) {
    const colors = useChartColors();

    const getChartData = () => {
        if (!yearlyStats?.per_month) return null;

        const monthOrder = MONTHS.map(m => m.id);
        const sortedMonths = Object.keys(yearlyStats.per_month)
            .sort((a, b) => monthOrder.indexOf(a.toLowerCase()) - monthOrder.indexOf(b.toLowerCase()));

        const labels = sortedMonths.map(m => getMonthName(m));
        const incomeData = sortedMonths.map(m => yearlyStats.per_month[m]?.income?.total || 0);
        const expenseData = sortedMonths.map(m => yearlyStats.per_month[m]?.expense?.total || 0);
        const investData = sortedMonths.map(m => yearlyStats.per_month[m]?.invest?.total || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: incomeData,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Pengeluaran',
                    data: expenseData,
                    backgroundColor: colors.expenseBg,
                    borderColor: colors.expenseBorder,
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Investasi',
                    data: investData,
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

    const chartData = getChartData();

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Year Selector */}
            <div className="flex justify-center">
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                    className="select-glass font-semibold"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <StatCard
                    icon={TrendingUp}
                    iconGradient="bg-linear-to-br from-green-400 to-emerald-600"
                    value={formatRupiah(yearlyStats.overall.total_income)}
                    label="Total Pemasukan"
                    valueColor="var(--income)"
                />
                <StatCard
                    icon={TrendingDown}
                    iconGradient="bg-linear-to-br from-red-400 to-rose-600"
                    value={formatRupiah(yearlyStats.overall.total_expense)}
                    label="Total Pengeluaran"
                    valueColor="var(--expense)"
                />
                <StatCard
                    icon={LineChart}
                    iconGradient="bg-linear-to-br from-indigo-400 to-violet-600"
                    value={formatRupiah(yearlyStats.overall.total_invest || 0)}
                    label="Total Investasi"
                    valueColor="var(--invest)"
                />
                <StatCard
                    icon={PiggyBank}
                    iconGradient="bg-linear-to-br from-blue-400 to-cyan-600"
                    value={formatRupiah(yearlyStats.overall.total_income - yearlyStats.overall.total_expense - (yearlyStats.overall.total_invest || 0))}
                    label="Saldo Bersih"
                />
                <StatCard
                    icon={BarChart2}
                    iconGradient="bg-linear-to-br from-purple-400 to-fuchsia-600"
                    value={formatRupiah(yearlyStats.overall.avg_expense)}
                    label="Rata-rata Pengeluaran"
                />
            </div>

            {/* Bar Chart */}
            {chartData && (
                <BarChartCard
                    title="Grafik Pemasukan, Pengeluaran & Investasi"
                    icon={BarChart3}
                    data={chartData}
                    options={chartOptions}
                />
            )}

            {/* Min/Max Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {yearlyStats.overall.max_expense && (
                    <MinMaxCard
                        title="Pengeluaran Terbesar"
                        icon={Flame}
                        iconColor="var(--expense)"
                        data={yearlyStats.overall.max_expense}
                        valueColor="var(--expense)"
                    />
                )}
                {yearlyStats.overall.min_expense && (
                    <MinMaxCard
                        title="Pengeluaran Terkecil"
                        icon={Heart}
                        iconColor="var(--income)"
                        data={yearlyStats.overall.min_expense}
                        valueColor="var(--income)"
                    />
                )}
            </div>

            {/* Monthly Breakdown */}
            <MonthlyBreakdown
                perMonth={yearlyStats.per_month}
                onMonthClick={onMonthClick}
            />
        </div>
    );
}
