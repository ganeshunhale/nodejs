import { Router } from "express";
import { LoginUser, LogOutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import VerifyJWt from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(
    upload.fields([
        {name:"avatar",
        maxCount:1
        },
        {name:"coverImage",
        maxCount:1
        }
    ]),
    registerUser)
router.route('/login').post(
    LoginUser)

    //secure Routes with jwt verification
router.route('/logout').post(
    VerifyJWt,
    LogOutUser)

export default router;