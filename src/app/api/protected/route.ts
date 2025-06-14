// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import connectMongo from '@/dbConnect/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    
    const middlewareResponse = await authMiddleware(request);
    if (middlewareResponse) {
      return middlewareResponse;
    }

    // Now TypeScript knows about request.user
    if (!request.user) {
      return NextResponse.json(
        { error: 'User not found in request' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'You have access to this protected route',
      user: {
        id: request.user._id,
        username: request.user.username,
        email: request.user.email,
      },
    });

  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}