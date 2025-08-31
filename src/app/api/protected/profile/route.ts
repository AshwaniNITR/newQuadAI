import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, validateCSRF } from '@/helpers/authHelpers';
import User from '@/models/userModel';

export async function GET(request: NextRequest) {
  const { user, error } = await validateAuth(request);
  
  if (error) return error;
  
  try {
    const userData = await User.findById(user!.userId).select('-password -refreshToken');
    
    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Validate authentication
  const { user, error } = await validateAuth(request);
  if (error) return error;
  
  // Validate CSRF for state-changing operations
  if (!validateCSRF(request)) {
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    );
  }
  
  try {
    const body = await request.json();
    const { username, bio } = body;
    
    const updatedUser = await User.findByIdAndUpdate(
      user!.userId,
      { username, bio },
      { new: true, select: '-password -refreshToken' }
    );
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}