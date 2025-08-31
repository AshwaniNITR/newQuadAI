import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import User from "../../../../models/userModel";
import connectMongo from "../../../../dbConnect/dbConnect";
import { generateTokens } from "../../../../helpers/getToken";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectMongo();
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Regular email/password login flow
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password +refreshToken"
    );

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

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email before logging in",
          needsVerification: true,
        },
        { status: 403 }
      );
    }

    // Generate tokens and CSRF token
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const { accessToken, refreshToken } = generateTokens(tokenPayload);
    const csrfToken = generateCSRFToken();

    // Hash refresh token and store with expiration timestamp
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Store hashed token with expiration timestamp appended
    const refreshTokenExpires = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now
    const tokenWithExpiry = `${hashedRefreshToken}:${refreshTokenExpires}`;
    
    user.refreshToken = tokenWithExpiry;
    await user.save();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      accessToken,
      csrfToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
      },
    });

    // Set access token cookie (short-lived)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    // Set refresh token cookie (long-lived, httpOnly, restricted path)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // (previously:-/api/auth)
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Set CSRF token as HTTP-only cookie (for server validation)
    response.cookies.set("csrfToken", csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Set non-HTTP-only CSRF token for client-side access
    response.cookies.set("X-CSRF-Token", csrfToken, {
      httpOnly: false, // Accessible by JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
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

// Generate CSRF token
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to parse token with expiry (for use in refresh endpoint)
// export function parseRefreshTokenWithExpiry(storedToken: string): { 
//   token: string; 
//   expiresAt: number;
//   isValid: boolean;
// } {
//   if (!storedToken || !storedToken.includes(':')) {
//     return { token: '', expiresAt: 0, isValid: false };
//   }

//   const [token, expiry] = storedToken.split(':');
//   const expiresAt = parseInt(expiry, 10);
//   const isValid = !isNaN(expiresAt) && expiresAt > Date.now();

//   return { token, expiresAt, isValid };
// }