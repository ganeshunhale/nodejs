import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefereshToken = async(userId)=>{
try {
    const user = await User.findById(userId)
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({
        validateBeforeSave:false
    })
    return {accessToken,refreshToken}
    
} catch (error) {
    throw new ApiError(500,"somthing went wrong while generating Tokens")
}

}
const registerUser = asyncHandler(async (req, res) => {
    //----------------------todos ----------------------
    // get user details from frontend 
    // validation -not empty
    // check if user alserady exist: username,email
    // check for img and check for avatar
    // upload them to cloudinary ,avatar,cover image
    // create user object in db
    // remove password and token fiels from response
    // check user is created in db
    const { username, email, fullName, password } = req.body;
    console.log(username, email, fullName);
    if ([username, email, fullName, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    console.log(existedUser);
    console.log(req.files);
    if (existedUser) {
        throw new ApiError(409, "user already exist")
        return res.status(409).json(new ApiResponse(409, "user already exist"))
    }



    const AvatarLocalFilePath = req.files?.avatar[0]?.path
    let CoverLocalFilePath;

    if (req.files && req.files.coverImage && req.files.coverImage.lenght > 0) {
        CoverLocalFilePath = req.files.coverImage[0]?.path || null;
    }

    if (!AvatarLocalFilePath) {
        throw new ApiError(400, "Avatar is required")
    }

    const Avatar = await uploadCloudinary(AvatarLocalFilePath)
    //  console.log("CoverLocalFilePath",CoverLocalFilePath);
    let CoverImage;
    if (CoverLocalFilePath) {
        CoverImage = await uploadCloudinary(CoverLocalFilePath)
    }
    // console.log(CoverImage);
    if (!Avatar) {
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.create({
        fullName,
        avatar: Avatar.secure_url,
        coverImage: CoverImage?.secure_url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    const selectedUser = await User.findById(user._id).select("-password -refreshToken")

    if (!selectedUser) {
        throw new ApiError(500, "somthing went wrong while creating user")
    }
    return res.status(201).json(new ApiResponse(200, "User Registered Successfully", selectedUser))

    // return res.status(200).json({ success: true,data:username, message: "User registered successfully" });
});


const LoginUser = asyncHandler(async (req, res) => {
    //----------------------todos ---------------------- 
//get payload from frontend in req.body 
//validate payload
//check in the User model if user exist 
//if not exist throw error
//if exist check password with bcrypt
//if password not match throw error
//password matches creat access token and refresh token
//send access token and refresh token to frontend
//save refresh token in db
//remove password and refresh token from response
//send response to frontend

const {username,email,password}= req.body
if(!username){

    throw new ApiError(401,"enter valid username or email")

   
}
const user= await User.findOne({
    $or:[{username},{email}]
})
if(!user){
    throw new ApiError(404,"user not found")
}
console.log(user);

const isPasswordValid = await user.isPasswordMatch(password)
if (!isPasswordValid) {
    throw new ApiError(401,"invald user credentials")
}

const {accessToken,refreshToken} = await generateAccessTokenAndRefereshToken(user._id)

const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

const options={
    httpOnly:true,
    secure:true
}
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(new ApiResponse(200,"user is logged in successfully",
{user:loggedInuser,
    accessToken,refreshToken
    
}
))


//created assestockenn and refreshtoken method

});

const LogOutUser = asyncHandler(async (req,res)=>{ 
    try {

        //req.user is being added from middleware auth (VerifyJWt)
        const user =req.user
        const updateuser=await User.findByIdAndUpdate(user._id,{

            $set:{

                refreshToken:undefined
            }
        })

        console.log({updateuser});
        
        if(!updateuser){
            throw new ApiError(401,"failed to logout user")
        }
        const options ={
            httpOnly:true,
            secure:true
        }
        


       
        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,"user logged out"))


        
    } catch (error) {
        throw new ApiError(401,"failed to logout")
    }

})

const refreshTokenForAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
console.log(incomingRefreshToken);
if (!incomingRefreshToken) {
    throw new ApiError(401,"unauthorized request")
}
   try {
 
     const verifiedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
     const user = await User.findById(verifiedToken.id)
     console.log("refreshtoken and found user",incomingRefreshToken,user);
     
     if(!user){
         throw new ApiError(401,"invalid refresh token")
     }
     if(incomingRefreshToken != user?.refreshToken){
         throw new ApiError(401,"failed to match token")
     }
     const {accessToken,refreshToken} = await generateAccessTokenAndRefereshToken(user._id)
 
     const options ={
        httpOnly:true,
        secure :true
     }
     return res.status(200).cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(new ApiResponse(200,"Accesstoken Genereated"))
     
   } catch (error) {
    throw new ApiError(401,"failed to match refresh token")
   }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    let user = await User.findById(req.user.id);
    let passwordMatched = await user.isPasswordMatch(oldPassword)
    if(!passwordMatched){
        return new ApiError(401,"password not matched")
    }
    user.password = newPassword

    await user.save({ validateBeforeSave:false })

    return res.status(200).json(new ApiResponse(200,"password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{

    return res.status(200).json(new ApiResponse(200,"current user sent",req?.user))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
const {fullName,email} = req.body
if(!fullName || !email){
    throw new ApiError(400,"All fields are required")
}
const user = await User.findByIdAndUpdate(req.user?.id,{
 $set:{
    fullName,
    email
 }
},{new:true}).select("-password -refreshToken")

return res.status(200).json(new ApiResponse(200,"account details updated succesfully",user))

})

const updateUserAvatar =asyncHandler(async(req,res)=>{

    const avatarLocalFile = req.file
if (!avatarLocalFile) {
throw new ApiError(400,"Error uploading Avatar")
}
const Avatar = await uploadCloudinary(avatarLocalFile)

if (!Avatar.secure_url) {
    throw new ApiError(400,"failed to upload Avatar") 
}
const user = await User.findByIdAndUpdate(req.user?.id,{
    $set:{
        avatar:Avatar?.secure_url
    }
},{
    new:true
}).select("-password -refreshToken")

return res.status(200).json(new ApiResponse(200,"Avatar changed Successfully",user))
})
const updateUserCover =asyncHandler(async(req,res)=>{

    const CoverLocalFilePath = req.file
if (!CoverLocalFilePath) {
throw new ApiError(400,"Error uploading Cover Image")
}
const coverImage = await uploadCloudinary(CoverLocalFilePath)

if (!coverImage.secure_url) {
    throw new ApiError(400,"failed to upload Cover Image") 
}
const user = await User.findByIdAndUpdate(req.user?.id,{
    $set:{
        coverImage:coverImage?.secure_url
    }
},{
    new:true
}).select("-password -refreshToken")

return res.status(200).json(new ApiResponse(200,"Cover Image changed Successfully",user))
})
export {
    registerUser,
    LoginUser,
    LogOutUser,
    refreshTokenForAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCover
};

