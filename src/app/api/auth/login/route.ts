import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../../../models/userModel";
import connectMongo from "../../../../dbConnect/dbConnect";
import { generateTokens } from "../../../../helpers/getToken";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    await connectMongo();
    const reqBody = await request.json();
    const { email, password} = reqBody;    
      // Regular email/password login flow
     if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      console.log(`Email: ${email}, Password: ${password}`);
      const normalizedEmail = email.toLowerCase();
      const user = await User.findOne({ email: normalizedEmail }).select(
        "+password +refreshToken"
      );
      console.log(`User found: ${user ? "Yes" : "No"}`);
      console.log(user);

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
      // Verify password
      if (!user.password) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Optional: Check if email is verified
      if (!user.isVerified) {
        return NextResponse.json(
          {
            error: "Please verify your email before logging in",
            needsVerification: true,
          },
          { status: 403 }
        );
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      };

      const { accessToken, refreshToken } = generateTokens(tokenPayload);

      // Store new refresh token in database
      user.refreshToken = refreshToken;
      await user.save();

      // Set refresh token as httpOnly cookie
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
        },
      });

    
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: true, //set true in prod
        sameSite: "lax", // less restrictive for cross-origin requests
        path: "/",
        domain: ".latest-quad.vercel.app/", // note the dot for subdomain coverage
        maxAge: 7 * 24 * 60 * 60, // in seconds
      });
      
      return response;
    
  } catch (error: unknown) {
    console.error("Login Error:", error);
    return NextResponse.json(
      {
        error: "An error occurred during login",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
