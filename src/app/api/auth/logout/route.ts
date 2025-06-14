import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';


export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      // Remove refresh token from database
      await User.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Clear cookie
    response.cookies.delete('refreshToken');

    return response;

  } catch (error: unknown) {
    return NextResponse.json(
      { error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}