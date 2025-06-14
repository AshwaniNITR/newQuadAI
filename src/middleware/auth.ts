// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/helpers/getToken';
import User from '@/models/userModel';

export const authMiddleware = async (request: NextRequest) => {
  try {
    const accessToken = request.headers.get('authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token missing' },
        { status: 401 }
      );
    }

    const { valid, decoded } = verifyAccessToken(accessToken);
    
    if (!valid || !decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    request.user = user;
    return NextResponse.next();

  } catch (error: unknown) {
    return NextResponse.json(
      { error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : 'Internal Server Error' },
      { status: 500 }
    );
  }
};