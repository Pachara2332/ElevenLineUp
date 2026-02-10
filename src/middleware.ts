import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Define paths
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/community') || 
    pathname.startsWith('/minigames') || 
    pathname.startsWith('/profile');

  // Case 1: User is NOT logged in but tries to access a protected page
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optional: Add a 'from' query param to redirect back after login
    // loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: User IS logged in but tries to access login/register pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder content (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
