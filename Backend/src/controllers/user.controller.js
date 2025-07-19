import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uplouploadOnCloudinary from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  //  if(fullName === ""){
  //     throw new ApiError(400 , "fullName is Required")
  //  }
  if (
    [fullName, password, username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required ");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if(existedUser){
    throw new ApiError(409 , "User With this email or username is already exist" )
  }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path

   if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar File is required ")
   }

   const avatar = await uplouploadOnCloudinary(avatarLocalPath)
   const coverImage = await uplouploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
        throw new ApiError(400 , "Avatar File is required ")
   }

    const user = await User.create({
     fullName,
     avatar : avatar.url,
     coverImage : coverImage?.url || "",
     email,
     password,
     username: username.toLowercase()
   })

   const createdUser = await User.findById(user._id).select(
     "-password -refreshToken"
   )


   if(!createdUser){
    throw  new ApiError(500 , "Something went wrong while registering the user ")
   }
   return res.status(201).json(
    ApiResponse(200, createdUser , "User Registered Successfully ! ")
   )

});
