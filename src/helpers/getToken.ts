import {NextRequest} from "next/server"
import jwt from "jsonwebtoken"
export  const  getdatafromtoken=(request:NextRequest)=>{
  try {
    const token= request.cookies.get("token")?.value || "";
    console.log("token: ",token)
    const verifiedToken:any= jwt.verify(token,process.env.TOKEN_SECRET!);
    console.log("verifiedToken : ",verifiedToken);
    return verifiedToken.id

  } catch (error:any) {
       throw new error(error.message)
  }
}