import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '@/models/userModel';
import connectMongo from '@/dbConnect/dbConnect';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token'); // Retrieve the token from cookies

    if (!token || !token.value) {
        // No token found, return Unauthorized
        return NextResponse.json({ error: 'Unauthorized', isVerified: false }, { status: 401 });
    }

    try {
        // Verify the token to get the decoded payload
        const decodedToken = jwt.verify(token.value, process.env.TOKEN_SECRET!) as JwtPayload;
        console.log(decodedToken);
        // Extract user ID from the decoded token
        const userId = decodedToken.id;

        // Connect to the database
        await connectMongo();

        // Find the user by ID and select only the isVerified field
        const user = await User.findById(userId).select('isVerified');
        console.log(user)

        if (!user) {
            // Return 404 if user not found
            return NextResponse.json({ error: 'User not found', isVerified: false }, { status: 404 });
        }

        // Return the isVerified status of the user
        return NextResponse.json({ isVerified: user.isVerified });
    } catch (error) {
        console.error('Error verifying token or fetching user:', error);
        // Return generic server error for unexpected issues
        return NextResponse.json({ error: 'Server error', isVerified: false }, { status: 500 });
    }
}
