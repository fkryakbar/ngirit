'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    fetchMonthlyStats,
    getCurrentMonth,
    getCurrentYear,
    type MonthlyStatsResponse
} from '@/lib/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import BottomNav from '@/components/dashboard/BottomNav';
import MonthlyView from '@/components/dashboard/MonthlyView';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

function MonthlyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const initialMonth = searchParams.get('month') || getCurrentMonth();
    const initialYear = searchParams.get('year') ? Number(searchParams.get('year')) : getCurrentYear();

    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStatsResponse | null>(null);

    const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - i);

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

    const loadMonthlyStats = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            const data = await fetchMonthlyStats(selectedMonth, selectedYear, token);
            setMonthlyStats(data);
        } catch (err) {
            setError('Gagal memuat data bulanan');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, selectedMonth, selectedYear]);

    useEffect(() => {
        if (token) {
            loadMonthlyStats();
        }
    }, [token, loadMonthlyStats]);

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="spinner w-10 h-10" />
                </div>
            )}

            {error && !loading && (
                <div className="glass p-4 text-center text-sm" style={{ color: 'var(--expense)' }}>
                    <p>{error}</p>
                    <button onClick={loadMonthlyStats} className="btn btn-primary mt-3">
                        Coba Lagi
                    </button>
                </div>
            )}

            {!loading && !error && monthlyStats && (
                <MonthlyView
                    monthlyStats={monthlyStats}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    years={years}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                />
            )}

            {!loading && !error && !monthlyStats && (
                <div className="glass p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada data untuk periode ini</p>
                    <div className="mt-4 flex gap-2 justify-center flex-wrap">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="input-field select-glass"
                        >
                            <option value="januari">Januari</option>
                            <option value="februari">Februari</option>
                            <option value="maret">Maret</option>
                            <option value="april">April</option>
                            <option value="mei">Mei</option>
                            <option value="juni">Juni</option>
                            <option value="juli">Juli</option>
                            <option value="agustus">Agustus</option>
                            <option value="september">September</option>
                            <option value="oktober">Oktober</option>
                            <option value="november">November</option>
                            <option value="desember">Desember</option>
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="input-field select-glass"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </>
    );
}

export default function MonthlyPage() {
    return (
        <div className="min-h-screen p-3 md:p-6 mb-24 relative">
            <div className="floating-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
                <div className="shape shape-4" />
            </div>

            <BottomNav />

            <Suspense fallback={
                <div className="flex justify-center items-center py-16">
                    <div className="spinner w-10 h-10" />
                </div>
            }>
                <MonthlyContent />
            </Suspense>
        </div>
    );
}
