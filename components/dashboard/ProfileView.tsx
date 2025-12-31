'use client';

import { useTheme } from 'next-themes';
import { Wallet, Sun, Moon, LogOut, User, Shield, Mail } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    name: string;
}

interface ProfileViewProps {
    mounted: boolean;
    user: UserData | null;
    onLogout: () => void;
}

export default function ProfileView({ mounted, user, onLogout }: ProfileViewProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* App Header */}
            <div className="glass p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                    <Wallet className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-on-glass)' }}>Ngirit</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Expense Tracker</p>
            </div>

            {/* User Info */}
            <div className="glass p-4">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                    <User className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    Informasi Pengguna
                </h3>
                <div className="space-y-3">
                    {/* Name */}
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-hover)' }}>
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Nama</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>
                                {user?.name || 'Loading...'}
                            </p>
                        </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-hover)' }}>
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Email</p>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>
                                {user?.email || 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="glass p-4">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-on-glass)' }}>
                    <Shield className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    Pengaturan
                </h3>
                <div className="space-y-2">
                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-3 rounded-lg transition-all glass-hover"
                        >
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? (
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                        <Sun className="w-5 h-5 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                        <Moon className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className="text-left">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-on-glass)' }}>
                                        {theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        Ketuk untuk mengubah tema
                                    </p>
                                </div>
                            </div>
                            <div
                                className="w-12 h-6 rounded-full p-1 transition-colors"
                                style={{ background: theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                            >
                                <div
                                    className="w-4 h-4 rounded-full bg-white transition-transform"
                                    style={{ transform: theme === 'dark' ? 'translateX(1.5rem)' : 'translateX(0)' }}
                                />
                            </div>
                        </button>
                    )}

                    {/* Logout */}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all"
                        style={{ color: 'var(--expense)' }}
                    >
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-400 to-rose-500 flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium">Keluar</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Logout dari aplikasi</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* App Version */}
            <div className="text-center py-4">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Ngirit v1.0.0
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    © 2025 Expense Tracker
                </p>
            </div>
        </div>
    );
}
