import { NextResponse } from 'next/server';

const protectedRoutes = {
  '/farmer': ['farmer'],
  '/buyer': ['buyer'],
  '/provider': ['provider'],
  '/admin': ['admin'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Token presence check via cookie (set on login — optional enhancement)
  // For pure localStorage-based auth, route protection is handled client-side.
  // This middleware handles the admin route as a basic example.
  const matchedPrefix = Object.keys(protectedRoutes).find((prefix) => pathname.startsWith(prefix));

  if (matchedPrefix) {
    // If you implement httpOnly cookies later, decode JWT here.
    // Currently protection is handled by client-side ProtectedRoute component.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/farmer/:path*', '/buyer/:path*', '/provider/:path*', '/admin/:path*'],
};
