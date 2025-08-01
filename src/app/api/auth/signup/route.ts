import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import User from '@/models/userModel';
//import dbConnect from '@/utils/dbConnect';
import { sendEmail } from '@/helpers/mailer';
//import { generateTokens } from '@/helpers/getToken';
import connectMongo from '@/dbConnect/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await connectMongo();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await newUser.save() as typeof newUser & { _id: string };

    // Send verification email
    await sendEmail({
      email: savedUser.email,
      emailType: 'VERIFY',
      userId: savedUser._id.toString(),
    });

    // Generate tokens
    // const { accessToken, refreshToken } = generateTokens({
    //   userId: savedUser._id.toString(),
    //   email: savedUser.email,
    //   username: savedUser.username,
    // });

    // Save refresh token to database
    // savedUser.refreshToken = refreshToken;
    // await savedUser.save();

    // Create response
    // const response = NextResponse.json({
    //   success: true,
    //   message: 'User registered successfully. Please check your email to verify your account.',
    //   accessToken,
    // });

    // Set HTTP-only cookie for refresh token
    // response.cookies.set('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60, // 7 days
    //   path: '/',
    // });

    //return response;
    return NextResponse.json({
      success:true,
      message:"User Registered Successfully. Please Check Your email for verification."    })

  }catch (error: unknown) {
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Internal Server Error' 
      },
      { status: 500 }
    );
  }
}