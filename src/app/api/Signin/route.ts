
import connectMongo from "@/dbConnect/dbConnect";
import User from "@/models/userModel";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectMongo();

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json(); // Use json() to parse the request body
        const {email, password }: any = reqBody;
        

        // Validation
        console.log("Request Body:", reqBody); // Log the request body
        const user= await User.findOne({email});
        if(!user){
            return NextResponse.json({error:"User doesnot exist"},{status:400}) ;      
         }
         console.log("user exists");
         const validPassword= await bcryptjs.compare(password,user.password);
         console.log(validPassword);
         if(!validPassword){
            return NextResponse.json({error:"Incorrect Password"},{status:400});
         }
         // const tokenData={
         //    id: user._id,
         //    username: user.username,
         //    email:user.email,
         // }
         // console.log(tokenData)
         // const token= jwt.sign(tokenData,(process.env.TOKEN_SECRET!),{expiresIn:'1d'})
         // console.log(token)
         const response=NextResponse.json({
            message:"User registered successfully",
            success:true
         })
         // response.cookies.set("token",token,{
         //    httpOnly:true
         // })
         return response

    } catch (error:any) {
        return NextResponse.json({error:error},{status:500})
    }
}