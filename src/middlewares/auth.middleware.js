import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
const VerifyJWt = asyncHandler(async (req,_,next)=>{

 try {
    const token = req.cookies?.accessToken||req.header['authorization'].replace('Bearer ','')
    if(!token){
        throw new ApiError(401,"unauthorized request")
    }
    const validToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) 
   if(!validToken){
       throw new ApiError(401,"token validation failed")
   }
   
   const user = await User.findById(validToken?.id).select("-password -refreshToken")
   
   if(!user){
       throw new ApiError(401,"Invalid access token")
   }
   req.user= user
   next()
 } catch (error) {
    throw new ApiError(401,error.message||"failed to validate")
 }

})

export default VerifyJWt