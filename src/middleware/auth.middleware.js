import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, resizeBy, next) => {

    try {
        // 1️⃣ Get token from cookies or Authorization header
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // 2️⃣ Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // 3️⃣ Find user in DB
        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token: User not found");
        }


        // 4️⃣ Attach user info to request
        // ✅ Continue to next middleware or route
        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid or expired access token");
    }

})