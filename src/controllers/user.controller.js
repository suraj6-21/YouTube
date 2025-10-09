import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // get users details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check image, avatar
    // upload them to cloudinary, avtor
    // create user object - create entry in DB  
    // remove password and refresh token field from response 
    // check for user creation
    // return response 


    // validation - not empty
    const { fullname, username, email, password } = req.body
    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    // check if user already exists: username, email
    const existingUser = User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }


    // check image, avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    
    // upload them to cloudinary, avtor
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    // create user object - create entry in DB  
    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    // remove password and refresh token field from response 
    // check for user creation
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // return response 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User register Successfuly")
    )



})

export { registerUser }