import connectMongo from "@/dbConnect/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import { sendemail } from "@/helpers/mailer";

connectMongo();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody.params; // Access token correctly
        console.log("Received token:", token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: "User Does Not Exist" }, { status: 400 });
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "User Created Successfully",
            success: true,
        });
    } catch (error: any) {
        console.error("Error during email verification:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
