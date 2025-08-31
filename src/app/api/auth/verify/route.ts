// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';
import crypto from 'crypto';

interface JWTPayload {
  userId: string;
  emailType: string;
}

interface UserDocument {
  _id: string;
  email: string;
  isVerified: boolean;
  refreshToken?: string;
  save(): Promise<UserDocument>;
}

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const token = request.nextUrl.searchParams.get('token');
    const isApiRequest = request.headers.get('accept')?.includes('application/json');

    if (!token) {
      if (isApiRequest) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
      }
      return NextResponse.redirect(new URL('/auth/verification-failed?error=missing_token', request.url));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JWTPayload;

    if (decoded.emailType !== 'VERIFY') {
      if (isApiRequest) {
        return NextResponse.json({ error: 'Invalid token type' }, { status: 400 });
      }
      return NextResponse.redirect(new URL('/auth/verification-failed?error=invalid_token_type', request.url));
    }

    // Find and update user
    const user = await User.findById(decoded.userId) as UserDocument | null;
    if (!user) {
      if (isApiRequest) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.redirect(new URL('/auth/verification-failed?error=user_not_found', request.url));
    }

    // Generate tokens and CSRF token
    const csrfToken = generateCSRFToken();
    
    if (user.isVerified) {
      // User already verified - generate new tokens
      const { accessToken, refreshToken } = await generateAndSetTokens(user);
      
      if (isApiRequest) {
        const response = NextResponse.json({
          success: true,
          message: 'Email already verified',
          accessToken,
          user: { id: user._id, email: user.email }
        });
        return setAuthCookies(response, accessToken, refreshToken, csrfToken);
      }
      
      return createAuthResponse('/home', accessToken, refreshToken, csrfToken, request);
    }

    // Mark user as verified and generate tokens
    user.isVerified = true;
    const { accessToken, refreshToken } = await generateAndSetTokens(user);
    await user.save();

    if (isApiRequest) {
      const response = NextResponse.json({
        success: true,
        message: 'Email verified successfully',
        accessToken,
        user: { id: user._id, email: user.email }
      });
      return setAuthCookies(response, accessToken, refreshToken, csrfToken);
    }

    return createAuthResponse('/home', accessToken, refreshToken, csrfToken, request);

  } catch (error) {
    console.error('Verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
        
    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.redirect(new URL(`/auth/verification-failed?error=${encodeURIComponent(errorMessage)}`, request.url));
  }
}

async function generateAndSetTokens(user: UserDocument): Promise<{ accessToken: string; refreshToken: string }> {
  // Generate access token
  const accessToken = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { userId: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  // Hash and store refresh token with expiry
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const refreshTokenExpires = Date.now() + (7 * 24 * 60 * 60 * 1000);
  const tokenWithExpiry = `${hashedRefreshToken}:${refreshTokenExpires}`;
  
  user.refreshToken = tokenWithExpiry;
  await user.save();

  return { accessToken, refreshToken };
}

function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function createAuthResponse(
  redirectPath: string, 
  accessToken: string, 
  refreshToken: string,
  csrfToken: string,
  request: NextRequest
): NextResponse {
  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  return setAuthCookies(response, accessToken, refreshToken, csrfToken);
}

function setAuthCookies(
  response: NextResponse, 
  accessToken: string, 
  refreshToken: string, 
  csrfToken: string
): NextResponse {
  // Set access token cookie
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });

  // Set refresh token cookie
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  // Set CSRF token cookie (HTTP-only for security)
  response.cookies.set('csrfToken', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  // Set client-accessible CSRF token
  response.cookies.set('X-CSRF-Token', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });

  return response;
}