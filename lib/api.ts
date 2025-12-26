// API utilities for Ngirit

export interface TransactionMin {
    amount: number;
    notes: string;
    date: string;
    month: string;
    type: string;
    year?: number;
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
}

export interface YearlyStatsResponse {
    per_month: Record<string, MonthData>;
    overall: {
        total_income: number;
        total_expense: number;
        avg_income: number;
        avg_expense: number;
        min_income: TransactionMin | null;
        max_income: TransactionMin | null;
        min_expense: TransactionMin | null;
        max_expense: TransactionMin | null;
    };
}

export interface Transaction {
    row_number: number;
    message_id: number;
    user_id: number;
    type: 'income' | 'expense';
    notes: string;
    amount: number;
    date: string;
    month: string;
    year: number;
    receipt_url: string;
}

export interface MonthlyStatsResponse {
    period: {
        month: string;
        year: number;
    };
    statistics: {
        income: StatBlock;
        expense: StatBlock;
        overall: {
            total_income: number;
            total_expense: number;
            avg_income: number;
            avg_expense: number;
            min_income: TransactionMin | null;
            max_income: TransactionMin | null;
            min_expense: TransactionMin | null;
            max_expense: TransactionMin | null;
        };
    };
    data: Transaction[];
}

const BASE_URL = 'https://n8n-ywbawfpsgdaa.runner.web.id/webhook/ngirit';

export async function fetchYearlyStats(year: number, token: string): Promise<YearlyStatsResponse> {
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

    return response.json();
}

export async function fetchMonthlyStats(month: string, year: number, token: string): Promise<MonthlyStatsResponse> {
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

    return response.json();
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
    // Format: "25-12-2025 11:04:59" to readable format
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const date = new Date(`${year}-${month}-${day}T${timePart}`);

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
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
