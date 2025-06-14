import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
//import { NextResponse } from 'next/server';

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

// Generate tokens
export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '30m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Verify access token
export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};

// Verify refresh token
export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
    
    // Check if token exists in database
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return { valid: false, error: 'Invalid refresh token' };
    }

    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
};