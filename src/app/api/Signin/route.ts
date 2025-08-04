import connectMongo from "@/dbConnect/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Define types for input and token data
interface SigninRequestBody {
    email: string;
    password: string;
}

interface TokenData {
    id: string;
    username: string;
    email: string;
}

connectMongo();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody as SigninRequestBody;

        // Validation
        console.log("Request Body:", reqBody);
        
        const user = await User.findOne({ email }) as {
            _id: string;
            username: string;
            email: string;
            password: string;
        } | null;
        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" }, 
                { status: 400 }
            );      
        }
        
        console.log("user exists");
        
        const validPassword = await bcryptjs.compare(password, user.password);
        console.log(validPassword);
        
        if (!validPassword) {
            return NextResponse.json(
                { error: "Incorrect Password" }, 
                { status: 400 }
            );
        }

        // Uncomment and update token generation if needed
        const tokenData: TokenData = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(
            tokenData, 
            process.env.TOKEN_SECRET!, 
            { expiresIn: '1d' }
        );

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

        // Set token in cookies
       // Set token in cookies
response.cookies.set("token", token, {
  httpOnly: true,
  secure: true, // Always require HTTPS in production
  sameSite: 'none', // Required for cross-site/cross-domain usage
  maxAge: 24 * 60 * 60, // 1 day
  path: '/',
  // Add if using multiple subdomains (e.g., api.domain.com and app.domain.com)
  domain: '.vercel.app' // Note the leading dot
});

        return response;

    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}