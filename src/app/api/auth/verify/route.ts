// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';

// Define interfaces for better type safety
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

interface TokenPair {
  accessToken: string;
  refreshToken: string;
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

    if (user.isVerified) {
      const { accessToken, refreshToken } = await generateAndSetTokens(user);
      if (isApiRequest) {
        return NextResponse.json({
          success: true,
          message: 'Email already verified',
          accessToken
        });
      }
      return createAuthResponse('/home', accessToken, refreshToken, request);
    }

    user.isVerified = true;
    const { accessToken, refreshToken } = await generateAndSetTokens(user);
    await user.save();

    if (isApiRequest) {
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully',
        accessToken
      });
    }
    return createAuthResponse('/home', accessToken, refreshToken, request);

  } catch (error) {
    console.error('Verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
        
    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.redirect(new URL(`/auth/verification-failed?error=${encodeURIComponent(errorMessage)}`, request.url));
  }
}

async function generateAndSetTokens(user: UserDocument): Promise<TokenPair> {
  const accessToken = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
}

function createAuthResponse(
  redirectPath: string, 
  accessToken: string, 
  refreshToken: string, 
  request: NextRequest
): NextResponse {
  const response = NextResponse.redirect(new URL(redirectPath, request.url));

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
}