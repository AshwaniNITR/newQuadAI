import { NextRequest, NextResponse } from 'next/server';
//import User from '@/models/userModel';
import { generateTokens, verifyRefreshToken } from '@/helpers/getToken';
import connectMongo from '@/dbConnect/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token missing' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const { valid, decoded, error } = await verifyRefreshToken(refreshToken);
    
    if (!valid || !decoded) {
      return NextResponse.json(
        { error: error || 'Invalid refresh token' },
        { status: 403 }
      );
    }

    // Generate new access token
    const { accessToken } = generateTokens({
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    });

    return NextResponse.json({
      success: true,
      accessToken,
    });

  } catch (error: unknown) {
      return NextResponse.json(
        { error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : 'Internal Server Error' },
        { status: 500 }
      );
    }
}