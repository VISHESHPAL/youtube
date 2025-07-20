import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefreshTokens = async(userId) =>{
    try {

         const user = await User.findById(userId)
         const accessToken = user.generateAccessToken()
         const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await  user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}

      
    } catch (error) {
      throw new ApiError(500 , "Somthing went wrong while refresh and access token ")
    }
}


export const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if ([fullName, password, username, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

//   console.log(req.files)

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User Registered Successfully!")
  );
});


export const loginUser =  asyncHandler (async (req, res) =>{
   
  const {email ,username , password} = req.body;
  
  if(!username || !email){
    throw new ApiError(400 , "Username is Password is required ");
  }

  const user = await User.findOne({
    $or : [{username} , {email}]
  })
  if(!user){
    throw new ApiError(404 , "User doesnot exist")
  }

  const isPasswordValid  = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401 , "Invalid user crediantials")
  }

  const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
  }

  return res
  .status(200)
  .cookie("accessToken" , accessToken ,options)
  .cookie("refreshToekn" ,refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user : loggedInUser, accessToken,
        refreshToken
      },
      "User Logged In Successfuuully ! "
    )
  )

})

export const logout = asyncHandler(async (req, res) =>{
    User.findByIdAndUpdate(
        req.user._id,{
          $set :{
            refreshToken : undefined
          }
        },{
          new: true
        }
    )  

    const options = {
    httpOnly : true,
    secure : true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(
      200 , {} ,"User Loggod Out"
    )
  )

}) 