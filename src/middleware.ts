import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = ['/home', '/Upload', '/Dehaze'];
const authRoutes = ['/login', '/register', '/signup', '/auth'];
const publicRoutes = ['/', '/about', '/contact', '/api/auth/refresh'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`🛡️  Middleware: ${request.method} ${pathname}`);
  
  // Skip middleware for public routes and static files
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api/auth/refresh') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  console.log('🍪 Access token present:', !!accessToken);
  console.log('🍪 Refresh token present:', !!refreshToken);
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  console.log('🔒 Is protected route:', isProtectedRoute);
  console.log('🔑 Is auth route:', isAuthRoute);
  console.log('🌍 Is public route:', isPublicRoute);
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Handle auth routes - redirect to home if already authenticated
  if (isAuthRoute && accessToken) {
    console.log('🏠 Already authenticated - redirecting to home');
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  // Handle protected routes
  if (isProtectedRoute) {
    // If no access token but refresh token exists, try to refresh
    if (!accessToken && refreshToken) {
      console.log('🔄 No access token but refresh token available - redirecting to refresh');
      const refreshUrl = new URL('/api/auth/refresh', request.url);
      refreshUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(refreshUrl);
    }
    
    // If no tokens at all, redirect to login
    if (!accessToken && !refreshToken) {
      console.log('❌ No tokens - redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If we have an access token, let it through (the API will validate it)
    if (accessToken) {
      console.log('✅ Access token present - allowing access');
      return NextResponse.next();
    }
  }
  
  // CSRF validation for state-changing API requests
  if (pathname.startsWith('/api/') && 
      request.method !== 'GET' && 
      !pathname.startsWith('/api/auth/')) {
    const csrfCookie = request.cookies.get('X-CSRF-Token')?.value;
    const csrfHeader = request.headers.get('X-CSRF-Token');
    
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      console.log('❌ CSRF validation failed');
      return NextResponse.json(
        { error: 'CSRF token validation failed' },
        { status: 403 }
      );
    }
  }
  
  console.log('✅ Middleware passed - continuing');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/refresh (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};