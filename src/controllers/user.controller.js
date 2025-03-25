import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password} = req.body;
    console.log(username, email, fullName);
    if([username,email,fullName,password].some(field=>field?.trim()=="")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser= await User.findOne({
        $or:[{username},{email}]
    })
    console.log(existedUser);
    
    if(existedUser){
        throw new ApiError(409,"user already exist")
    }

    
      const AvatarLocalFilePath=  req.files?.avatar[0]?.path
      const CoverLocalFilePath=  req.files?.coverImage[0]?.path
    
      if(!AvatarLocalFilePath){
            throw new ApiError(400,"Avatar is required")
      }

     const Avatar = await uploadCloudinary(AvatarLocalFilePath)
     const CoverImage = await uploadCloudinary(CoverLocalFilePath)
     if(!Avatar){
        throw new ApiError(400,"Avatar upload failed")
     }

     const user = await User.create({
        fullName,
        avatar:Avatar.url,
        coverImage:CoverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
     })


    const selectedUser = await User.findById(user._id).select("-password -refreshToken")

    if(!selectedUser){
        throw new ApiError(500,"somthing went wrong while creating user")
    }
    return res.status(201).json(new ApiResponse(200,"User Registered Successfully",selectedUser))

// return res.status(200).json({ success: true,data:username, message: "User registered successfully" });
});
export { registerUser };


// get user details from frontend 
// validation -not empty
// check if user alserady exist: username,email
// check for img and check for avatar
// upload them to cloudinary ,avatar,cover image
// create user object in db
// remove password and token fiels from response
// check user is created in db