import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';

interface AuthUser {
  userId: string;
  email: string;
  username?: string;
}

export async function validateAuth(request: NextRequest): Promise<{
  user: AuthUser | null;
  error: NextResponse | null;
}> {
  try {
    await connectMongo();
    
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Access token required' },
          { status: 401 }
        )
      };
    }
    
    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as AuthUser;
    
    // Optional: Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isVerified) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'User not found or not verified' },
          { status: 401 }
        )
      };
    }
    
    return { user: decoded, error: null };
    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Token expired', needsRefresh: true },
          { status: 401 }
        )
      };
    }
    
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    };
  }
}

export function validateCSRF(request: NextRequest): boolean {
  const csrfCookie = request.cookies.get('X-CSRF-Token')?.value;
  const csrfHeader = request.headers.get('X-CSRF-Token');
  
  return !!(csrfCookie && csrfHeader && csrfCookie === csrfHeader);
}