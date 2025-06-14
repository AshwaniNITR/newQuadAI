// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await connectMongo();
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}