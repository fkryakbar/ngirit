'use client';

import { useState } from 'react';
import { List } from 'lucide-react';
import { formatRupiah, formatDate, type Transaction } from '@/lib/api';
import { getCategoryConfig } from '@/lib/categoryIcons';

type FilterType = 'all' | 'income' | 'expense' | 'invest';
type SortField = 'date' | 'amount';
type SortOrder = 'asc' | 'desc';

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [searchQuery, setSearchQuery] = useState('');

    const getFilteredTransactions = (): Transaction[] => {
        let filtered = [...transactions];

        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.notes.toLowerCase().includes(query)
            );
        }

        filtered.sort((a, b) => {
            if (sortField === 'amount') {
                return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            } else {
                const parseDate = (dateStr: string) => {
                    if (dateStr.includes(' ')) {
                        const [datePart, timePart] = dateStr.split(' ');
                        const [day, month, year] = datePart.split('-');
                        const [hours, minutes, seconds] = timePart.split(':');
                        const normalizedTime = [
                            hours.padStart(2, '0'),
                            minutes.padStart(2, '0'),
                            seconds.padStart(2, '0')
                        ].join(':');
                        return new Date(`${year}-${month}-${day}T${normalizedTime}`);
                    }
                    return new Date(dateStr);
                };
                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return sortOrder === 'asc'
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }
        });

        return filtered;
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <div className="glass p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                    <List className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    Daftar Transaksi
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-glass py-1.5 pl-8 pr-3 w-32 text-sm"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                        className="select-glass py-1.5 text-sm"
                    >
                        <option value="all">Semua</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                        <option value="invest">Investasi</option>
                    </select>

                    <select
                        value={`${sortField}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-');
                            setSortField(field as SortField);
                            setSortOrder(order as SortOrder);
                        }}
                        className="select-glass py-1.5 text-sm"
                    >
                        <option value="date-desc">Terbaru</option>
                        <option value="date-asc">Terlama</option>
                        <option value="amount-desc">Nominal ↓</option>
                        <option value="amount-asc">Nominal ↑</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <p>Tidak ada transaksi ditemukan</p>
                    </div>
                ) : (
                    filteredTransactions.map((transaction, index) => {
                        const categoryConfig = getCategoryConfig(transaction.category);
                        const CategoryIcon = categoryConfig.icon;
                        const getTypeColor = () => {
                            if (transaction.type === 'income') return 'var(--income)';
                            if (transaction.type === 'invest') return 'rgb(99, 102, 241)';
                            return 'var(--expense)';
                        };
                        const getTypeLabel = () => {
                            if (transaction.type === 'income') return 'Masuk';
                            if (transaction.type === 'invest') return 'Investasi';
                            return 'Keluar';
                        };
                        const getBadgeClass = () => {
                            if (transaction.type === 'income') return 'badge badge-income';
                            if (transaction.type === 'invest') return 'badge badge-invest';
                            return 'badge badge-expense';
                        };
                        return (
                            <div key={transaction.message_id || index} className="transaction-item rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ background: categoryConfig.bgColor }}>
                                        <CategoryIcon className="w-4 h-4" style={{ color: categoryConfig.color }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>{transaction.notes}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(transaction.date)}</p>
                                            {transaction.category && (
                                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: categoryConfig.bgColor, color: categoryConfig.color }}>
                                                    {categoryConfig.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold" style={{ color: getTypeColor() }}>
                                        {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
                                    </p>
                                    <span className={getBadgeClass()}>
                                        {getTypeLabel()}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
