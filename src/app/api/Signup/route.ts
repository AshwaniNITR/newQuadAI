import connectMongo from "@/dbConnect/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

// Define interfaces for type safety
interface SignupRequestBody {
    username: string;
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
        const { username, email, password } = reqBody as SignupRequestBody;

        // Validation
        console.log("Request Body:", reqBody);

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json(
                { error: "User Already Exists" }, 
                { status: 400 }
            );
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedpassword,
        });

        // Prepare token data
        const tokenData: TokenData = {
            id: newUser._id.toString(),
            username: newUser.username,
            email: newUser.email,
        };

        // Generate JWT token
        const token = jwt.sign(
            tokenData, 
            process.env.TOKEN_SECRET!, 
            { expiresIn: '1d' }
        );

        // Save the new user
        const savedUser = await newUser.save();
        console.log("Saved User:", savedUser);

        // Send verification email
        await sendEmail({ 
            email, 
            emailType: "VERIFY", 
            userId: savedUser._id.toString() 
        });
      
        // Prepare response
        const response = NextResponse.json({
            message: "User registered Successfully",
            success: true,
            savedUser: savedUser.toObject(),
        });

        // Set token in cookies
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 // 1 day
        });

        return response;

    } catch (error) {
        // Use more specific error handling
        console.error("Error during registration:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Registration failed" }, 
            { status: 500 }
        );
    }
}