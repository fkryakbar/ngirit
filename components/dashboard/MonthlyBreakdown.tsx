'use client';

import { formatRupiah, getMonthName, type MonthData } from '@/lib/api';
import { Calendar } from 'lucide-react';

interface MonthlyBreakdownProps {
    perMonth: Record<string, MonthData>;
    onMonthClick: (month: string) => void;
}

export default function MonthlyBreakdown({ perMonth, onMonthClick }: MonthlyBreakdownProps) {
    return (
        <div className="glass p-4">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                Ringkasan Per Bulan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {Object.entries(perMonth).map(([month, data]) => (
                    <div
                        key={month}
                        className="glass glass-hover p-3 cursor-pointer"
                        onClick={() => onMonthClick(month.toLowerCase())}
                    >
                        <h4 className="font-semibold text-sm mb-2 capitalize" style={{ color: 'var(--text-on-glass)' }}>
                            {getMonthName(month)}
                        </h4>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--income)' }}>Masuk</span>
                                <span className="font-medium" style={{ color: 'var(--income)' }}>
                                    {formatRupiah(data.income.total)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--expense)' }}>Keluar</span>
                                <span className="font-medium" style={{ color: 'var(--expense)' }}>
                                    {formatRupiah(data.expense.total)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span style={{ color: 'var(--invest)' }}>Invest</span>
                                <span className="font-medium" style={{ color: 'var(--invest)' }}>
                                    {formatRupiah(data.invest?.total || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
