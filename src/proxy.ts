import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Get the auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Define paths
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminPage = pathname.startsWith('/admin');
  const isProtectedUserPage = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/community') || 
    pathname.startsWith('/minigames') || 
    pathname.startsWith('/profile');

  let role: string | null = null;
  if (token) {
    try {
      // Very basic JWT decode in Edge context (Middleware)
      // The payload is the second chunk splitting by '.'
      const payloadBase64Url = token.split('.')[1];
      if (payloadBase64Url) {
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/, '/');
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        role = payload.role || 'USER';
      }
    } catch (e) {
      console.error("JWT Decode error in middleware:", e);
    }
  }

  // Case 1: Unauthenticated user trying to access ANY protected page (admin or user)
  if ((isProtectedUserPage || isAdminPage) && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: User is IS logged in but tries to access login/register pages
  if (isAuthPage && token) {
    if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Case 3: Logged in user tries to access Admin page but is NOT an admin
  if (isAdminPage && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Or / if dashboard not preferred
  }

  // Case 4: Admin tries to access User-only protected pages (optional enforced separation)
  if (isProtectedUserPage && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
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
