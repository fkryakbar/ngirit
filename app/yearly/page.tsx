'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    fetchYearlyStats,
    getCurrentYear,
    type YearlyStatsResponse
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
import YearlyView from '@/components/dashboard/YearlyView';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function YearlyPage() {
    const router = useRouter();
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const [yearlyStats, setYearlyStats] = useState<YearlyStatsResponse | null>(null);

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

    useEffect(() => {
        if (token) {
            loadYearlyStats();
        }
    }, [token, loadYearlyStats]);

    const handleMonthClick = (month: string) => {
        router.push(`/monthly?month=${month}&year=${selectedYear}`);
    };

    return (
        <div className="min-h-screen p-3 md:p-6 mb-24 relative">
            <div className="floating-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
                <div className="shape shape-4" />
            </div>

            <BottomNav />

            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="spinner w-10 h-10" />
                </div>
            )}

            {error && !loading && (
                <div className="glass p-4 text-center text-sm" style={{ color: 'var(--expense)' }}>
                    <p>{error}</p>
                    <button onClick={loadYearlyStats} className="btn btn-primary mt-3">
                        Coba Lagi
                    </button>
                </div>
            )}

            {!loading && !error && yearlyStats && (
                <YearlyView
                    yearlyStats={yearlyStats}
                    selectedYear={selectedYear}
                    years={years}
                    onYearChange={setSelectedYear}
                    onMonthClick={handleMonthClick}
                />
            )}
        </div>
    );
}
