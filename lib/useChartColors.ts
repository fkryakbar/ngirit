'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export interface ChartColors {
    legendColor: string;
    tooltipBg: string;
    tooltipTitleColor: string;
    tooltipBodyColor: string;
    tickColor: string;
    gridColor: string;
    expenseBg: string;
    expenseBorder: string;
}

export function useChartColors(): ChartColors {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default to light theme colors, will update after mount
    if (!mounted) {
        return {
            legendColor: 'rgba(26,26,46,0.8)',
            tooltipBg: 'rgba(255,255,255,0.95)',
            tooltipTitleColor: '#1a1a2e',
            tooltipBodyColor: '#4a5568',
            tickColor: 'rgba(74,85,104,0.8)',
            gridColor: 'rgba(16,185,129,0.1)',
            expenseBg: 'rgba(220, 38, 38, 0.8)',
            expenseBorder: 'rgba(220, 38, 38, 1)',
        };
    }

    const isDark = theme === 'dark';

    return {
        legendColor: isDark ? 'rgba(241,245,249,0.8)' : 'rgba(26,26,46,0.8)',
        tooltipBg: isDark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
        tooltipTitleColor: isDark ? '#f1f5f9' : '#1a1a2e',
        tooltipBodyColor: isDark ? '#94a3b8' : '#4a5568',
        tickColor: isDark ? 'rgba(148,163,184,0.8)' : 'rgba(74,85,104,0.8)',
        gridColor: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(16,185,129,0.1)',
        expenseBg: isDark ? 'rgba(248, 113, 113, 0.8)' : 'rgba(220, 38, 38, 0.8)',
        expenseBorder: isDark ? 'rgba(248, 113, 113, 1)' : 'rgba(220, 38, 38, 1)',
    };
}
