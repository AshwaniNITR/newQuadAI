import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import User from '@/models/userModel';
import { generateTokens } from '@/helpers/getToken';
import connectMongo from '@/dbConnect/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email }) as {
      _id: { toString: () => string },
      email: string,
      username: string,
      password: string,
      isVerified: boolean,
      refreshToken?: string,
      save: () => Promise<void>
    } | null;
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 403 }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      accessToken,
    });

    // Set HTTP-only cookie for access token
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error: unknown) {
    return NextResponse.json(
      { error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}