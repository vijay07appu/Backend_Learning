import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
   const{userName,fullName,email,password}=req.body;


   // checking if all fields are present.
   if([userName,fullName,email,password].some((field)=>
    field?.trim() === ""
   ))
   {
    throw new ApiError(400,"All fields are required")
   }

   // now checking wheter username , email present or not 
   const existedUser = await User.findOne({
    $or: [ {userName}, { email }]
})
console.log("existedUser"+existedUser)

if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}

console.log("User existed completed");


   const avatarLocalPath=req.files?.avatar[0]?.path;
//    const coverImageLocalPath=req.files?.coverImage[0]?.path;
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
}

   if(!avatarLocalPath)
   {
    throw new ApiError(400,"Avatarpath is required ...")
   }

   const avatar=await uploadOnCloudinary(avatarLocalPath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)
   console.log("avatar"+avatar)
   if(!avatar)
   {
    throw new ApiError(400,"Avatar not uploaded on cloudinary ...")
   }

   console.log("uploading images completed");

   // adding entries to the database 

   const user=await User.create({
    fullName,
    email,
    userName:userName.toLowerCase(),
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    password

   })

   
   console.log("user creation completed");
  // checking whether user is created or not , if created then their will "_id"
  const createdUser= await User.findById(user._id).select("-password -refreshToken");
  

  console.log("removing password and refreshToken completed");

  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering");
  }
  console.log("sending response below ");
  return res.status(201).json(
    
    new ApiResponse(200,createdUser,"User registered successfully ")
  )




})

export {registerUser}