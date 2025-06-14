import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import { sendEmail } from '@/helpers/mailer';
import connectMongo from '@/dbConnect/dbConnect';

export async function POST(request: Request) {
  try {
    await connectMongo();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }) as { _id: { toString: () => string }, email: string, isVerified: boolean } | null;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Send verification email
    await sendEmail({
      email: user.email,
      emailType: 'VERIFY',
      userId: user._id.toString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Verification email resent successfully',
    });

  } catch (error: unknown) {
      return NextResponse.json(
        { error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : 'Internal Server Error' },
        { status: 500 }
      );
    }
}