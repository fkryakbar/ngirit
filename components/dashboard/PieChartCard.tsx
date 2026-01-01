'use client';

import { Pie } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { type LucideIcon } from 'lucide-react';

interface PieChartCardProps {
    title: string;
    icon: LucideIcon;
    data: ChartData<'pie'>;
    options: ChartOptions<'pie'>;
}

export default function PieChartCard({ title, icon: Icon, data, options }: PieChartCardProps) {
    return (
        <div className="glass p-4">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                {title}
            </h3>
            <div className="chart-container" style={{ height: '300px' }}>
                <Pie data={data} options={options} />
            </div>
        </div>
    );
}
