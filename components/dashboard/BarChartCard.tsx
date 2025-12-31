'use client';

import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { type LucideIcon } from 'lucide-react';

interface BarChartCardProps {
    title: string;
    icon: LucideIcon;
    data: ChartData<'bar'>;
    options: ChartOptions<'bar'>;
}

export default function BarChartCard({ title, icon: Icon, data, options }: BarChartCardProps) {
    return (
        <div className="glass p-4">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                {title}
            </h3>
            <div className="chart-container">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
