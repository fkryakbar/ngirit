// Category icons mapping for Ngirit
import {
    Utensils,
    Coffee,
    Car,
    Fuel,
    Zap,
    Droplets,
    Wifi,
    Smartphone,
    Home,
    CreditCard,
    ShoppingBag,
    Heart,
    GraduationCap,
    Gamepad2,
    HandHeart,
    FileText,
    ClipboardList,
    Wallet,
    Award,
    Gift,
    Percent,
    Briefcase,
    Building2,
    PiggyBank,
    TrendingUp,
    LineChart,
    FileCheck,
    Coins,
    Bitcoin,
    Building,
    Landmark,
    Store,
    Users,
    Shield,
    HelpCircle,
    type LucideIcon
} from 'lucide-react';

export interface CategoryConfig {
    icon: LucideIcon;
    label: string;
    color: string;
    bgColor: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    // Expense categories
    makan: {
        icon: Utensils,
        label: 'Makan',
        color: '#f97316',
        bgColor: 'rgba(249, 115, 22, 0.15)'
    },
    makanan: {
        icon: Utensils,
        label: 'Makanan',
        color: '#f97316',
        bgColor: 'rgba(249, 115, 22, 0.15)'
    },
    minum: {
        icon: Coffee,
        label: 'Minum',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.15)'
    },
    minuman: {
        icon: Coffee,
        label: 'Minuman',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.15)'
    },
    transport: {
        icon: Car,
        label: 'Transport',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.15)'
    },
    bensin: {
        icon: Fuel,
        label: 'Bensin',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.15)'
    },
    listrik: {
        icon: Zap,
        label: 'Listrik',
        color: '#eab308',
        bgColor: 'rgba(234, 179, 8, 0.15)'
    },
    air: {
        icon: Droplets,
        label: 'Air',
        color: '#06b6d4',
        bgColor: 'rgba(6, 182, 212, 0.15)'
    },
    internet: {
        icon: Wifi,
        label: 'Internet',
        color: '#6366f1',
        bgColor: 'rgba(99, 102, 241, 0.15)'
    },
    pulsa: {
        icon: Smartphone,
        label: 'Pulsa',
        color: '#ec4899',
        bgColor: 'rgba(236, 72, 153, 0.15)'
    },
    sewa: {
        icon: Home,
        label: 'Sewa',
        color: '#84cc16',
        bgColor: 'rgba(132, 204, 22, 0.15)'
    },
    cicilan: {
        icon: CreditCard,
        label: 'Cicilan',
        color: '#f43f5e',
        bgColor: 'rgba(244, 63, 94, 0.15)'
    },
    belanja: {
        icon: ShoppingBag,
        label: 'Belanja',
        color: '#a855f7',
        bgColor: 'rgba(168, 85, 247, 0.15)'
    },
    kesehatan: {
        icon: Heart,
        label: 'Kesehatan',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.15)'
    },
    pendidikan: {
        icon: GraduationCap,
        label: 'Pendidikan',
        color: '#0ea5e9',
        bgColor: 'rgba(14, 165, 233, 0.15)'
    },
    hiburan: {
        icon: Gamepad2,
        label: 'Hiburan',
        color: '#f472b6',
        bgColor: 'rgba(244, 114, 182, 0.15)'
    },
    donasi: {
        icon: HandHeart,
        label: 'Donasi',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.15)'
    },
    pajak: {
        icon: FileText,
        label: 'Pajak',
        color: '#64748b',
        bgColor: 'rgba(100, 116, 139, 0.15)'
    },
    administrasi: {
        icon: ClipboardList,
        label: 'Administrasi',
        color: '#78716c',
        bgColor: 'rgba(120, 113, 108, 0.15)'
    },

    // Income categories
    gaji: {
        icon: Wallet,
        label: 'Gaji',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.15)'
    },
    honor: {
        icon: Award,
        label: 'Honor',
        color: '#14b8a6',
        bgColor: 'rgba(20, 184, 166, 0.15)'
    },
    bonus: {
        icon: Gift,
        label: 'Bonus',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.15)'
    },
    komisi: {
        icon: Percent,
        label: 'Komisi',
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.15)'
    },
    freelance: {
        icon: Briefcase,
        label: 'Freelance',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.15)'
    },
    bisnis: {
        icon: Building2,
        label: 'Bisnis',
        color: '#0891b2',
        bgColor: 'rgba(8, 145, 178, 0.15)'
    },
    hadiah: {
        icon: Gift,
        label: 'Hadiah',
        color: '#e11d48',
        bgColor: 'rgba(225, 29, 72, 0.15)'
    },
    bunga: {
        icon: PiggyBank,
        label: 'Bunga',
        color: '#059669',
        bgColor: 'rgba(5, 150, 105, 0.15)'
    },
    dividen: {
        icon: TrendingUp,
        label: 'Dividen',
        color: '#16a34a',
        bgColor: 'rgba(22, 163, 74, 0.15)'
    },
    penjualan: {
        icon: Store,
        label: 'Penjualan',
        color: '#0d9488',
        bgColor: 'rgba(13, 148, 136, 0.15)'
    },
    refund: {
        icon: FileCheck,
        label: 'Refund',
        color: '#2563eb',
        bgColor: 'rgba(37, 99, 235, 0.15)'
    },

    // Invest categories
    saham: {
        icon: LineChart,
        label: 'Saham',
        color: '#2563eb',
        bgColor: 'rgba(37, 99, 235, 0.15)'
    },
    reksadana: {
        icon: TrendingUp,
        label: 'Reksadana',
        color: '#7c3aed',
        bgColor: 'rgba(124, 58, 237, 0.15)'
    },
    obligasi: {
        icon: FileCheck,
        label: 'Obligasi',
        color: '#0369a1',
        bgColor: 'rgba(3, 105, 161, 0.15)'
    },
    emas: {
        icon: Coins,
        label: 'Emas',
        color: '#ca8a04',
        bgColor: 'rgba(202, 138, 4, 0.15)'
    },
    crypto: {
        icon: Bitcoin,
        label: 'Crypto',
        color: '#f7931a',
        bgColor: 'rgba(247, 147, 26, 0.15)'
    },
    properti: {
        icon: Building,
        label: 'Properti',
        color: '#65a30d',
        bgColor: 'rgba(101, 163, 13, 0.15)'
    },
    deposito: {
        icon: Landmark,
        label: 'Deposito',
        color: '#0284c7',
        bgColor: 'rgba(2, 132, 199, 0.15)'
    },
    usaha: {
        icon: Store,
        label: 'Usaha',
        color: '#9333ea',
        bgColor: 'rgba(147, 51, 234, 0.15)'
    },
    peer_to_peer: {
        icon: Users,
        label: 'P2P Lending',
        color: '#db2777',
        bgColor: 'rgba(219, 39, 119, 0.15)'
    },
    asuransi: {
        icon: Shield,
        label: 'Asuransi',
        color: '#059669',
        bgColor: 'rgba(5, 150, 105, 0.15)'
    },

    // Default
    lainnya: {
        icon: HelpCircle,
        label: 'Lainnya',
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.15)'
    }
};

export function getCategoryConfig(category?: string): CategoryConfig {
    if (!category) {
        return CATEGORY_CONFIG.lainnya;
    }
    return CATEGORY_CONFIG[category.toLowerCase()] || CATEGORY_CONFIG.lainnya;
}

export function getCategoryLabel(category?: string): string {
    return getCategoryConfig(category).label;
}
