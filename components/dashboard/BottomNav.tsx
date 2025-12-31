'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Calendar, User } from 'lucide-react';

const navItems = [
    { href: '/yearly', icon: BarChart3, label: 'Tahunan' },
    { href: '/monthly', icon: Calendar, label: 'Bulanan' },
    { href: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 flex justify-around items-center backdrop-blur-xl px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50"
            style={{
                background: 'var(--surface)',
                borderTop: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-glass)'
            }}
        >
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl text-xs font-medium transition-all duration-300 min-w-20"
                        style={{
                            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            background: isActive ? 'var(--income-light)' : 'transparent'
                        }}
                    >
                        <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
