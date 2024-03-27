import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
   const{userName,fullName,email,password}=req.body;


   // checking if all fields are present.
   if([userName,fullName,email,password].some((field)=>{
    field?.trim()===""
   }))
   {
    throw new ApiError(400,"All fields are required")
   }

   // now checking wheter username , email present or not 
  const existedUser= User.findOne({
    $or:[{userName},{email}]
   })
   console.log(existedUser)
   if(existedUser)
   {
    throw new ApiError(409," userName or email already exist")
   }


   const avatarLocalPath=req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage[0]?.path;

   if(!avatarLocalPath)
   {
    throw new ApiError(400,"Avatar is required ...")
   }

   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar)
   {
    throw new ApiError(400,"Avatar is required ...")
   }

   // adding entries to the database 

   const user=await User.create({
    fullName,
    userName:userName.toLowercase(),
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    password

   })

  // checking whether user is created or not , if created then their will "_id"
  const createdUser= await User.findById(user._id).select("-password - refreshToken");

  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering");
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully ")
  )




})

export {registerUser}