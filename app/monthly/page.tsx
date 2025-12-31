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
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import BottomNav from '@/components/dashboard/BottomNav';
import MonthlyView from '@/components/dashboard/MonthlyView';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
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
