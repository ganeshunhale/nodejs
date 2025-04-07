import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, LoginUser, LogOutUser, refreshTokenForAccessToken, registerUser, updateUserAvatar, updateAccountDetails, updateUserCover, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
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

router.route('/generate-accesstoken').post(
    refreshTokenForAccessToken)
//secure Routes with jwt verification
router.route('/logout').post(
    VerifyJWt,
    LogOutUser)

router.route('/change-password').post(
    VerifyJWt,
    changeCurrentPassword)
router.route('/current-user').post(
    VerifyJWt,
    getCurrentUser)
router.route('/update-account').post(
    VerifyJWt,
    updateAccountDetails)

router.route('/update-avatar').post(
    VerifyJWt,
    upload.single('avatar'),
    updateUserAvatar)
router.route('/update-cover').post(
    VerifyJWt,
    upload.single('coverImage'),
    updateUserCover)
router.route("/channel/:username").post(
    VerifyJWt,
    getUserChannelProfile)
router.route("/watch-history").post(
    VerifyJWt,
    getWatchHistory)
export default router;