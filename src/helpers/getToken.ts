import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define an interface for the token payload
interface TokenPayload {
    id: string;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

export const getdatafromtoken = (request: NextRequest): string => {
    try {
        const token = request.cookies.get("token")?.value || "";
        console.log("token: ", token);

        // Type assertion with the defined interface
        const verifiedToken = jwt.verify(
            token, 
            process.env.TOKEN_SECRET!
        ) as TokenPayload;

        console.log("verifiedToken : ", verifiedToken);
        return verifiedToken.id;

    } catch (error) {
        // More specific error handling
        const errorMessage = error instanceof Error 
            ? error.message 
            : "Token verification failed";
        
        throw new Error(errorMessage);
    }
};