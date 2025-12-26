'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    fetchYearlyStats,
    fetchMonthlyStats,
    formatRupiah,
    formatDate,
    MONTHS,
    getCurrentMonth,
    getCurrentYear,
    getMonthName,
    type YearlyStatsResponse,
    type MonthlyStatsResponse,
    type Transaction
} from '@/lib/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
    Wallet,
    Sun,
    Moon,
    LogOut,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    BarChart3,
    Calendar,
    BarChart2,
    Flame,
    Heart,
    Search,
    ArrowUpCircle,
    ArrowDownCircle,
    List,
    DollarSign,
    Receipt
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type ViewMode = 'yearly' | 'monthly';
type SortField = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'income' | 'expense';

export default function DashboardPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('yearly');
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Yearly view state
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const [yearlyStats, setYearlyStats] = useState<YearlyStatsResponse | null>(null);

    // Monthly view state
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentYear());
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStatsResponse | null>(null);

    // Transaction list state
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get token on mount
    useEffect(() => {
        const getToken = async () => {
            try {
                const res = await fetch('/api/auth/token');
                const data = await res.json();
                if (data.token) {
                    setToken(data.token);
                } else {
                    router.push('/');
                }
            } catch {
                router.push('/');
            }
        };
        getToken();
    }, [router]);

    // Fetch yearly stats
    const loadYearlyStats = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            const data = await fetchYearlyStats(selectedYear, token);
            setYearlyStats(data);
        } catch (err) {
            setError('Gagal memuat data tahunan');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, selectedYear]);

    // Fetch monthly stats
    const loadMonthlyStats = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            const data = await fetchMonthlyStats(selectedMonth, selectedMonthYear, token);
            setMonthlyStats(data);
        } catch (err) {
            setError('Gagal memuat data bulanan');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, selectedMonth, selectedMonthYear]);

    useEffect(() => {
        if (token && viewMode === 'yearly') {
            loadYearlyStats();
        }
    }, [token, viewMode, loadYearlyStats]);

    useEffect(() => {
        if (token && viewMode === 'monthly') {
            loadMonthlyStats();
        }
    }, [token, viewMode, loadMonthlyStats]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    // Filter and sort transactions
    const getFilteredTransactions = (): Transaction[] => {
        if (!monthlyStats?.data) return [];

        let filtered = [...monthlyStats.data];

        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.notes.toLowerCase().includes(query)
            );
        }

        filtered.sort((a, b) => {
            if (sortField === 'amount') {
                return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            } else {
                const dateA = new Date(a.date.split(' ')[0].split('-').reverse().join('-'));
                const dateB = new Date(b.date.split(' ')[0].split('-').reverse().join('-'));
                return sortOrder === 'asc'
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }
        });

        return filtered;
    };

    // Prepare chart data
    const getChartData = () => {
        if (!yearlyStats?.per_month) return null;

        const monthOrder = MONTHS.map(m => m.id);
        const sortedMonths = Object.keys(yearlyStats.per_month)
            .sort((a, b) => monthOrder.indexOf(a.toLowerCase()) - monthOrder.indexOf(b.toLowerCase()));

        const labels = sortedMonths.map(m => getMonthName(m));
        const incomeData = sortedMonths.map(m => yearlyStats.per_month[m]?.income?.total || 0);
        const expenseData = sortedMonths.map(m => yearlyStats.per_month[m]?.expense?.total || 0);

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
                    backgroundColor: theme === 'dark' ? 'rgba(248, 113, 113, 0.8)' : 'rgba(220, 38, 38, 0.8)',
                    borderColor: theme === 'dark' ? 'rgba(248, 113, 113, 1)' : 'rgba(220, 38, 38, 1)',
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
                    color: theme === 'dark' ? 'rgba(241,245,249,0.8)' : 'rgba(26,26,46,0.8)',
                    font: { size: 11, weight: 'bold' as const }
                }
            },
            tooltip: {
                backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
                titleColor: theme === 'dark' ? '#f1f5f9' : '#1a1a2e',
                bodyColor: theme === 'dark' ? '#94a3b8' : '#4a5568',
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
                ticks: { color: theme === 'dark' ? 'rgba(148,163,184,0.8)' : 'rgba(74,85,104,0.8)', font: { size: 10 } },
                grid: { color: theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(16,185,129,0.1)' }
            },
            y: {
                ticks: { color: theme === 'dark' ? 'rgba(148,163,184,0.8)' : 'rgba(74,85,104,0.8)', font: { size: 10 } },
                grid: { color: theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(16,185,129,0.1)' }
            }
        }
    };

    const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - i);

    return (
        <div className="min-h-screen p-3 md:p-6 relative">
            {/* Background Shapes */}
            <div className="floating-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
                <div className="shape shape-4" />
            </div>

            {/* Header */}
            <header className="glass mb-4 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold" style={{ color: 'var(--text-on-glass)' }}>Ngirit</h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Expense Tracker</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {mounted && (
                        <button onClick={toggleTheme} className="btn-glass p-2 rounded-full">
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    <button onClick={handleLogout} className="btn-glass px-3 py-1.5 flex items-center gap-1.5 text-xs">
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </header>

            {/* View Mode Tabs */}
            <div className="flex justify-center mb-4">
                <div className="tabs">
                    <button
                        className={`tab flex items-center gap-1.5 ${viewMode === 'yearly' ? 'active' : ''}`}
                        onClick={() => setViewMode('yearly')}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Tahunan
                    </button>
                    <button
                        className={`tab flex items-center gap-1.5 ${viewMode === 'monthly' ? 'active' : ''}`}
                        onClick={() => setViewMode('monthly')}
                    >
                        <Calendar className="w-4 h-4" />
                        Bulanan
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="spinner w-10 h-10" />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="glass p-4 text-center text-sm" style={{ color: 'var(--expense)' }}>
                    <p>{error}</p>
                    <button
                        onClick={() => viewMode === 'yearly' ? loadYearlyStats() : loadMonthlyStats()}
                        className="btn btn-primary mt-3"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* YEARLY VIEW */}
            {!loading && !error && viewMode === 'yearly' && yearlyStats && (
                <div className="space-y-4 animate-fade-in">
                    {/* Year Selector */}
                    <div className="flex justify-center">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="select-glass font-semibold"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Overall Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-green-400 to-emerald-600">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--income)' }}>{formatRupiah(yearlyStats.overall.total_income)}</div>
                            <div className="label">Total Pemasukan</div>
                        </div>
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-red-400 to-rose-600">
                                <TrendingDown className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--expense)' }}>{formatRupiah(yearlyStats.overall.total_expense)}</div>
                            <div className="label">Total Pengeluaran</div>
                        </div>
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-blue-400 to-indigo-600">
                                <PiggyBank className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--text-on-glass)' }}>{formatRupiah(yearlyStats.overall.total_income - yearlyStats.overall.total_expense)}</div>
                            <div className="label">Saldo Bersih</div>
                        </div>
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-purple-400 to-violet-600">
                                <BarChart2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--text-on-glass)' }}>{formatRupiah(yearlyStats.overall.avg_expense)}</div>
                            <div className="label">Rata-rata Pengeluaran</div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    {getChartData() && (
                        <div className="glass p-4">
                            <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                                <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                Grafik Pemasukan vs Pengeluaran
                            </h3>
                            <div className="chart-container">
                                <Bar data={getChartData()!} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {/* Min/Max Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {yearlyStats.overall.max_expense && (
                            <div className="glass p-4">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                                    <Flame className="w-4 h-4" style={{ color: 'var(--expense)' }} />
                                    Pengeluaran Terbesar
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{yearlyStats.overall.max_expense.notes}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(yearlyStats.overall.max_expense.date)}</p>
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: 'var(--expense)' }}>
                                        {formatRupiah(yearlyStats.overall.max_expense.amount)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {yearlyStats.overall.min_expense && (
                            <div className="glass p-4">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                                    <Heart className="w-4 h-4" style={{ color: 'var(--income)' }} />
                                    Pengeluaran Terkecil
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{yearlyStats.overall.min_expense.notes}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(yearlyStats.overall.min_expense.date)}</p>
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: 'var(--income)' }}>
                                        {formatRupiah(yearlyStats.overall.min_expense.amount)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Monthly Breakdown Cards */}
                    <div className="glass p-4">
                        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                            <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            Ringkasan Per Bulan
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                            {Object.entries(yearlyStats.per_month).map(([month, data]) => (
                                <div key={month} className="glass glass-hover p-3 cursor-pointer"
                                    onClick={() => {
                                        setSelectedMonth(month.toLowerCase());
                                        setSelectedMonthYear(selectedYear);
                                        setViewMode('monthly');
                                    }}>
                                    <h4 className="font-semibold text-sm mb-2 capitalize" style={{ color: 'var(--text-on-glass)' }}>{getMonthName(month)}</h4>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span style={{ color: 'var(--income)' }}>Masuk</span>
                                            <span className="font-medium" style={{ color: 'var(--income)' }}>{formatRupiah(data.income.total)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span style={{ color: 'var(--expense)' }}>Keluar</span>
                                            <span className="font-medium" style={{ color: 'var(--expense)' }}>{formatRupiah(data.expense.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MONTHLY VIEW */}
            {!loading && !error && viewMode === 'monthly' && monthlyStats && (
                <div className="space-y-4 animate-fade-in">
                    {/* Month/Year Selector */}
                    <div className="flex justify-center gap-2 flex-wrap">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="select-glass"
                        >
                            {MONTHS.map(month => (
                                <option key={month.id} value={month.id}>{month.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedMonthYear}
                            onChange={(e) => setSelectedMonthYear(Number(e.target.value))}
                            className="select-glass"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Monthly Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-green-400 to-emerald-600">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--income)' }}>{formatRupiah(monthlyStats.statistics.income.total)}</div>
                            <div className="label">Pemasukan ({monthlyStats.statistics.income.count}x)</div>
                        </div>
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-red-400 to-rose-600">
                                <Receipt className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--expense)' }}>{formatRupiah(monthlyStats.statistics.expense.total)}</div>
                            <div className="label">Pengeluaran ({monthlyStats.statistics.expense.count}x)</div>
                        </div>
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-blue-400 to-indigo-600">
                                <BarChart2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--text-on-glass)' }}>{formatRupiah(monthlyStats.statistics.overall.avg_expense)}</div>
                            <div className="label">Rata-rata</div>
                        </div>
                        <div className="glass glass-hover stat-card">
                            <div className="icon-wrapper bg-linear-to-br from-purple-400 to-violet-600">
                                <PiggyBank className="w-5 h-5 text-white" />
                            </div>
                            <div className="value" style={{ color: 'var(--text-on-glass)' }}>
                                {formatRupiah(monthlyStats.statistics.overall.total_income - monthlyStats.statistics.overall.total_expense)}
                            </div>
                            <div className="label">Saldo</div>
                        </div>
                    </div>

                    {/* Min/Max Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {monthlyStats.statistics.expense.max && (
                            <div className="glass p-4">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                                    <Flame className="w-4 h-4" style={{ color: 'var(--expense)' }} />
                                    Pengeluaran Terbesar
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{monthlyStats.statistics.expense.max.notes}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(monthlyStats.statistics.expense.max.date)}</p>
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: 'var(--expense)' }}>
                                        {formatRupiah(monthlyStats.statistics.expense.max.amount)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {monthlyStats.statistics.expense.min && (
                            <div className="glass p-4">
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                                    <Heart className="w-4 h-4" style={{ color: 'var(--income)' }} />
                                    Pengeluaran Terkecil
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{monthlyStats.statistics.expense.min.notes}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(monthlyStats.statistics.expense.min.date)}</p>
                                    </div>
                                    <div className="text-lg font-bold" style={{ color: 'var(--income)' }}>
                                        {formatRupiah(monthlyStats.statistics.expense.min.amount)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Transaction List */}
                    <div className="glass p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                                <List className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                Daftar Transaksi
                            </h3>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Search */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input-glass py-1.5 pl-8 pr-3 w-32 text-sm"
                                    />
                                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                                </div>

                                {/* Type Filter */}
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                                    className="select-glass py-1.5 text-sm"
                                >
                                    <option value="all">Semua</option>
                                    <option value="income">Pemasukan</option>
                                    <option value="expense">Pengeluaran</option>
                                </select>

                                {/* Sort */}
                                <select
                                    value={`${sortField}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortField(field as SortField);
                                        setSortOrder(order as SortOrder);
                                    }}
                                    className="select-glass py-1.5 text-sm"
                                >
                                    <option value="date-desc">Terbaru</option>
                                    <option value="date-asc">Terlama</option>
                                    <option value="amount-desc">Nominal ↓</option>
                                    <option value="amount-asc">Nominal ↑</option>
                                </select>
                            </div>
                        </div>

                        {/* Transaction Items */}
                        <div className="space-y-1.5 max-h-80 overflow-y-auto">
                            {getFilteredTransactions().length === 0 ? (
                                <div className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <p>Tidak ada transaksi ditemukan</p>
                                </div>
                            ) : (
                                getFilteredTransactions().map((transaction) => (
                                    <div key={transaction.message_id} className="transaction-item rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: transaction.type === 'income' ? 'var(--income-light)' : 'var(--expense-light)',
                                                }}>
                                                {transaction.type === 'income' ? (
                                                    <ArrowUpCircle className="w-4 h-4" style={{ color: 'var(--income)' }} />
                                                ) : (
                                                    <ArrowDownCircle className="w-4 h-4" style={{ color: 'var(--expense)' }} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{transaction.notes}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(transaction.date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold" style={{ color: transaction.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                                                {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
                                            </p>
                                            <span className={`badge ${transaction.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                                {transaction.type === 'income' ? 'Masuk' : 'Keluar'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
