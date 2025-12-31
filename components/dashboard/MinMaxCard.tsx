'use client';

import { type LucideIcon } from 'lucide-react';
import { formatRupiah, formatDate, type TransactionMin } from '@/lib/api';

interface MinMaxCardProps {
    title: string;
    icon: LucideIcon;
    iconColor: string;
    data: TransactionMin;
    valueColor: string;
}

export default function MinMaxCard({ title, icon: Icon, iconColor, data, valueColor }: MinMaxCardProps) {
    return (
        <div className="glass p-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
                {title}
            </h4>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{data.notes}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(data.date)}</p>
                </div>
                <div className="text-lg font-bold" style={{ color: valueColor }}>
                    {formatRupiah(data.amount)}
                </div>
            </div>
        </div>
    );
}
