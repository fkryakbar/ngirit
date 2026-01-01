import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ['/monthly', '/yearly', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
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

    // Redirect logged-in users from login page to yearly
    if (pathname === '/') {
        const token = request.cookies.get('auth-token')?.value;
        if (token) {
            const user = await verifyToken(token);
            if (user) {
                return NextResponse.redirect(new URL('/yearly', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/monthly/:path*', '/yearly/:path*', '/profile/:path*']
};
