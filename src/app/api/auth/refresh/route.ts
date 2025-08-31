import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';

// Helper function to parse refresh token with expiry
function parseRefreshTokenWithExpiry(storedToken: string): { 
  token: string; 
  expiresAt: number;
  isValid: boolean;
} {
  if (!storedToken || !storedToken.includes(':')) {
    return { token: '', expiresAt: 0, isValid: false };
  }

  const [token, expiry] = storedToken.split(':');
  const expiresAt = parseInt(expiry, 10);
  const isValid = !isNaN(expiresAt) && expiresAt > Date.now();

  return { token, expiresAt, isValid };
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Refresh endpoint called');
    await connectMongo();
    
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/home';
    
    console.log('🍪 Refresh token present:', !!refreshToken);
    console.log('🎯 Redirect URL:', redirectUrl);
    
    if (!refreshToken) {
      console.log('❌ No refresh token found - redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Hash the refresh token to compare with stored version
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    console.log('🔍 Looking for user with hashed token:', hashedToken.substring(0, 10) + '...');
    
    // Find user with this refresh token
    const user = await User.findOne({
      refreshToken: { $regex: `^${hashedToken}:` }
    }).select('+refreshToken');
    
    if (!user) {
      console.log('❌ User not found with refresh token');
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear invalid cookies
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      response.cookies.delete('csrfToken');
      response.cookies.delete('X-CSRF-Token');
      return response;
    }
    
    console.log('✅ User found:', user.email);
    
    // Parse and validate stored refresh token
    const { isValid } = parseRefreshTokenWithExpiry(user.refreshToken!);
    if (!isValid) {
      console.log('❌ Refresh token expired');
      // Clear expired token
      user.refreshToken = undefined;
      await user.save();
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verify refresh token JWT
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };
      
      if (decoded.userId !== user._id.toString()) {
        console.log('❌ Token userId mismatch');
        throw new Error('Token mismatch');
      }
    } catch (error) {
      console.log('❌ JWT verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    console.log('✅ Refresh token verified - generating new access token');
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        username: user.username 
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );
    
    console.log('✅ New access token generated');
    
    // Create response and set new access token
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });
    
    console.log('✅ Redirecting to:', redirectUrl);
    return response;
    
  } catch (error) {
    console.error('💥 Token refresh error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}