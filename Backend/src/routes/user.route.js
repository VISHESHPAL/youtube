import {Router}  from 'express';
import { loginUser, logout, refershAccessToken, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const userRouter =  Router();

userRouter.route("/register").post(upload.fields([
   {
    name : "avatar",
    maxCount: 1
   } ,
   {
    name : "coverImage",
    maxCount: 1
   }
]),
registerUser);

userRouter.route("/login").post(loginUser)
//  secured route 

userRouter.route("/logout" ).post( verifyJWT , logout)
userRouter.route("/refresh-token").post(refershAccessToken)
export default  userRouter ;