'use client';

import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    iconGradient: string;
    value: string;
    label: string;
    valueColor?: string;
}

export default function StatCard({
    icon: Icon,
    iconGradient,
    value,
    label,
    valueColor = 'var(--text-on-glass)'
}: StatCardProps) {
    return (
        <div className="glass glass-hover stat-card">
            <div className={`icon-wrapper ${iconGradient}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="value" style={{ color: valueColor }}>{value}</div>
            <div className="label">{label}</div>
        </div>
    );
}
