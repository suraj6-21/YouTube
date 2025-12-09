import { Router } from "express";
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

// Middleware runs first, then controller
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// Secure Route
router.route("/logout").post(verifyJWT, logoutUser)






export default router