import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        const user = await verifyToken(token);
        if (!user) {
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('auth-token');
            return response;
        }
    }

    // Redirect logged-in users from login page to dashboard
    if (pathname === '/') {
        const token = request.cookies.get('auth-token')?.value;
        if (token) {
            const user = await verifyToken(token);
            if (user) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*']
};
