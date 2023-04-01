import { Router } from 'express';
const router = Router();
import * as UserController from "./User.Controller.js"
import { asyncHandler } from "../../Utils/ErrorHandling.js";
import { auth } from '../../Middlewares/Authentication.js';
router.post('/signup',asyncHandler(UserController.signUp))
router.post('/signin',asyncHandler(UserController.login))
router.patch('/update',auth(),asyncHandler(UserController.updateUser))
router.post('/logout',auth(),asyncHandler(UserController.logout))
router.delete('/delete',auth(),asyncHandler(UserController.deleteUser))
router.post('/forget',asyncHandler(UserController.forgetPassword)) // request forget password (before login)
router.post('/reset',asyncHandler(UserController.ResetPassword)) // actual function for reseting password (before login and after sending email)
export default router;