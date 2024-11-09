import connectMongo from "@/dbConnect/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendemail } from "@/helpers/mailer";
import jwt from "jsonwebtoken"
connectMongo();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json(); // Use json() to parse the request body
        const { username, email, password }: any = reqBody;

        // Validation
        console.log("Request Body:", reqBody); // Log the request body

        // Check if the user already exists
        const user = await User.findOne({ email }); // Await the promise
        if (user) {
            return NextResponse.json({ error: "User Already Exists" }, { status: 400 });
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
        const tokenData={
            id: newUser._id,
            username: newUser.username,
            email:newUser.email,
         }
         console.log(tokenData)
         const token= jwt.sign(tokenData,(process.env.TOKEN_SECRET!),{expiresIn:'1d'})
         console.log(token)
        // Save the new user
        const savedUser = await newUser.save();
        console.log("Saved User:", savedUser); // Log the saved user

        // Send verification email
        await sendemail({ email, emailType: "VERIFY", userId: savedUser._id.toString()});
      
        // Return success response
        const response= NextResponse.json({
            message: "User registered Successfully",
            success: true,
            savedUser: savedUser.toObject(), // Convert Mongoose document to plain object if needed
        });
        response.cookies.set("token",token,{
            httpOnly:true
         })
         return response
    } catch (error: any) {
        console.error("Error during registration:", error); // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}