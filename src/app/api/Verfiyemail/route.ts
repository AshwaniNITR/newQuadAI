import connectMongo from "@/dbConnect/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// Define an interface for the request body
interface VerifyEmailRequestBody {
    params: {
        token: string;
    };
}

connectMongo();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = (reqBody as VerifyEmailRequestBody).params;
        console.log("Received token:", token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired verification token" }, 
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });

    } catch (error) {
        console.error("Error during email verification:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error 
                    ? error.message 
                    : "Email verification failed" 
            }, 
            { status: 500 }
        );
    }
}