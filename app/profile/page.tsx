'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/dashboard/BottomNav';
import ProfileView from '@/components/dashboard/ProfileView';

interface UserData {
    id: string;
    email: string;
    name: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch('/api/auth/user');
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/');
                }
            } catch {
                router.push('/');
            }
        };
        getUser();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <div className="min-h-screen p-3 md:p-6 mb-24 relative">
            <div className="floating-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
                <div className="shape shape-4" />
            </div>

            <BottomNav />

            <ProfileView
                mounted={mounted}
                user={user}
                onLogout={handleLogout}
            />
        </div>
    );
}
