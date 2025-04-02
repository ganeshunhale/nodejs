import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, LoginUser, LogOutUser, refreshTokenForAccessToken, registerUser, updateUserAvatar, updateAccountDetails, updateUserCover } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import VerifyJWt from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(
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
    registerUser)
router.route('/login').post(
    LoginUser)

//secure Routes with jwt verification
router.route('/logout').post(
    VerifyJWt,
    LogOutUser)
router.route('/generate-accesstoken').post(
    refreshTokenForAccessToken)

router.route('/change-password').post(
    VerifyJWt,
    changeCurrentPassword)
router.route('/current-user').post(
    VerifyJWt,
    getCurrentUser)
router.route('/update-accountDetails').post(
    VerifyJWt,
    updateAccountDetails)

router.route('/update-avatar').post(
    VerifyJWt,
    upload,
    updateUserAvatar)
router.route('/update-cover').post(
    VerifyJWt,
    upload,
    updateUserCover)
export default router;