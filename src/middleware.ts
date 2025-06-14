// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/home'];

export default async function middleware(request: NextRequest) {
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const accessToken = request.cookies.get('accessToken')?.value;
    console.log("AccessToken",accessToken)
    const response = await fetch(new URL('/api/auth/session', request.url), {
      headers: { Cookie: request.cookies.toString() }
    });
    
    const { user } = await response.json();
    
    if (!user || !user.isVerified) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Add user info to headers
    const headers = new Headers(request.headers);
    headers.set('x-user-id', user._id);
    headers.set('x-user-email', user.email);
    
    return NextResponse.next({ headers });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home']
};