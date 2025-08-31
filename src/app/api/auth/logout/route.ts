import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (refreshToken) {
      // Hash the refresh token and remove from database
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      await User.updateOne(
        { refreshToken: { $regex: `^${hashedToken}:` } },
        { $unset: { refreshToken: 1 } }
      );
    }
    
    // Create response and clear all auth cookies
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear all auth cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('csrfToken');
    response.cookies.delete('X-CSRF-Token');
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}