// API utilities for Ngirit

// Category types
export type TransactionCategory =
    | 'makan'
    | 'minum'
    | 'transport'
    | 'bensin'
    | 'listrik'
    | 'air'
    | 'internet'
    | 'pulsa'
    | 'sewa'
    | 'cicilan'
    | 'belanja'
    | 'kesehatan'
    | 'pendidikan'
    | 'hiburan'
    | 'donasi'
    | 'pajak'
    | 'administrasi'
    | 'gaji'
    | 'honor'
    | 'bonus'
    | 'komisi'
    | 'freelance'
    | 'bisnis'
    | 'hadiah'
    | 'bunga'
    | 'dividen'
    | 'penjualan'
    | 'refund'
    | 'saham'
    | 'reksadana'
    | 'obligasi'
    | 'emas'
    | 'crypto'
    | 'properti'
    | 'deposito'
    | 'usaha'
    | 'peer_to_peer'
    | 'asuransi'
    | 'lainnya';

export type TransactionType = 'income' | 'expense' | 'invest';

export interface TransactionMin {
    amount: number;
    notes: string;
    date: string;
    month: string;
    type: string;
    year?: number;
    category?: TransactionCategory;
}

export interface StatBlock {
    total: number;
    count: number;
    avg: number;
    min: TransactionMin | null;
    max: TransactionMin | null;
}

export interface MonthData {
    income: StatBlock;
    expense: StatBlock;
    invest: StatBlock;
}

export interface YearlyStatsResponse {
    per_month: Record<string, MonthData>;
    overall: {
        total_income: number;
        total_expense: number;
        total_invest: number;
        avg_income: number;
        avg_expense: number;
        avg_invest: number;
        min_income: TransactionMin | null;
        max_income: TransactionMin | null;
        min_expense: TransactionMin | null;
        max_expense: TransactionMin | null;
        min_invest: TransactionMin | null;
        max_invest: TransactionMin | null;
    };
}

export interface Transaction {
    row_number?: number;
    message_id?: number;
    user_id?: number;
    type: TransactionType;
    notes: string;
    amount: number;
    date: string;
    month: string;
    year: number;
    receipt_url?: string;
    category?: TransactionCategory;
}

export interface MonthlyStatsResponse {
    period: {
        month: string;
        year: number;
    };
    statistics: {
        income: StatBlock;
        expense: StatBlock;
        invest: StatBlock;
        overall: {
            total_income: number;
            total_expense: number;
            total_invest: number;
            avg_income: number;
            avg_expense: number;
            avg_invest: number;
            min_income: TransactionMin | null;
            max_income: TransactionMin | null;
            min_expense: TransactionMin | null;
            max_expense: TransactionMin | null;
            min_invest: TransactionMin | null;
            max_invest: TransactionMin | null;
        };
    };
    data: Transaction[];
}

const BASE_URL = 'https://n8n-ywbawfpsgdaa.runner.web.id/webhook/ngirit';

export async function fetchYearlyStats(year: number, token: string): Promise<YearlyStatsResponse | null> {
    const response = await fetch(`${BASE_URL}/get-stats-by-year?year=${year}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch yearly stats: ${response.status}`);
    }

    // Handle empty response from n8n
    const text = await response.text();
    if (!text || text.trim() === '') {
        return null;
    }

    return JSON.parse(text);
}

export async function fetchMonthlyStats(month: string, year: number, token: string): Promise<MonthlyStatsResponse | null> {
    const response = await fetch(`${BASE_URL}/get-stats-by-month?month=${month}&year=${year}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch monthly stats: ${response.status}`);
    }

    // Handle empty response from n8n
    const text = await response.text();
    if (!text || text.trim() === '') {
        return null;
    }

    return JSON.parse(text);
}

// Utility functions
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

export function formatDate(dateString: string): string {
    // Handle both formats: "25-12-2025 11:04:59" and "2025-01-15"
    if (dateString.includes(' ')) {
        // Format with time: "25-12-2025 11:04:59" or "27-12-2025 9:46:42"
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('-');

        // Normalize time part to handle times without leading zeros (e.g., "9:46:42")
        const [hours, minutes, seconds] = timePart.split(':');
        const normalizedTime = [
            hours.padStart(2, '0'),
            minutes.padStart(2, '0'),
            seconds.padStart(2, '0')
        ].join(':');

        const date = new Date(`${year}-${month}-${day}T${normalizedTime}`);

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } else {
        // Format without time: "2025-01-15"
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
    }
}

export const MONTHS = [
    { id: 'januari', name: 'Januari' },
    { id: 'februari', name: 'Februari' },
    { id: 'maret', name: 'Maret' },
    { id: 'april', name: 'April' },
    { id: 'mei', name: 'Mei' },
    { id: 'juni', name: 'Juni' },
    { id: 'juli', name: 'Juli' },
    { id: 'agustus', name: 'Agustus' },
    { id: 'september', name: 'September' },
    { id: 'oktober', name: 'Oktober' },
    { id: 'november', name: 'November' },
    { id: 'desember', name: 'Desember' }
];

export function getMonthName(monthId: string): string {
    const month = MONTHS.find(m => m.id.toLowerCase() === monthId.toLowerCase());
    return month?.name || monthId;
}

export function getCurrentMonth(): string {
    const monthIndex = new Date().getMonth();
    return MONTHS[monthIndex].id;
}

export function getCurrentYear(): number {
    return new Date().getFullYear();
}
