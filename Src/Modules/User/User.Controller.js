import { UserModel } from "../../../DB/Models/User.model.js"
import { sendEmail } from "../../Services/SendEmail.js";
import Cloudinary from "../../Utils/Cloudinary.js";
import { ComparingFunction, HashingFunction } from "../../Utils/HashingFunction.js";
import { tokenDecode, tokenGeneration } from "../../Utils/TokenFunction.js";
//=========================================  Start Signup  =========================================//
export const signUp = async (req, res, next) => {
    const { name, password, email } = req.body
    const usercheck = await UserModel.findOne({ email }).select('-_id email');
    if (usercheck) {
        return next(new Error('Email Already Exist', { cause: 409 }))
    }
    const hashedPassword = HashingFunction({ payload: password })
    const newUser = new UserModel({ name, password: hashedPassword, email })
    await newUser.save();
    res.status(201).json({ message: 'Signup Completed Successfully' })
}
//=========================================  End Signup  =========================================//

//=========================================  Start Login  =========================================//
export const login = async (req, res, next) => {
    const { password,email } = req.body;
    const isExist = await UserModel.findOne({ email });
    if (!isExist) {
        return next(new Error('Invalid Login Credentials', { cause: 400 }))
    }
    if (isExist.isConfirmed == false) {
        return next(new Error('Email is not Confirmed, Please Confirm Your Email', { cause: 400 }))
    }
    const Match = ComparingFunction({payload:password,ComparingPassword:isExist.password});
    if (!Match) {
        return next(new Error('invalid login information', { cause: 400 }))
    }
    const loggedInUser = await UserModel.findByIdAndUpdate(isExist._id, { isLoggedIn: true }, { new: true });
    if (!loggedInUser) {
        return next(new Error('Error While Logging In,Please Try to Login Again', { cause: 400 }))
    }
    const token = tokenGeneration({ payload: { _id: isExist._id, email: isExist.email, isloggedin: isExist.isLoggedIn } })
    res.status(200).json({ message: 'login success', token })
}
//=========================================  End Login  =========================================//
//=========================================  Start Update  =========================================//
export const updateUser = async (req, res, next) => {
    const { _id } = req.user
    const { password } = req.body
    const hashedPassword = HashingFunction({ payload: password })
    const UpdatedUser = await UserModel.findByIdAndUpdate(_id, { password: hashedPassword })
    if (UpdatedUser) return res.status(200).json({ message: "Updated Successfully" })
    next(new Error("Updating Failed"))
}
//=========================================  End Update  =========================================//
//=========================================  Start Delete  =========================================//
export const deleteUser = async (req, res, next) => {
    const { _id } = req.user
    const DeletedUser = await UserModel.findByIdAndDelete(_id)
    if (DeletedUser) return res.status(200).json({ message: "Deleted Successfully" })
    next(new Error("Deleting Failed"))
}
//=========================================  End Delete  =========================================//
//=========================================  Start Forgetpassword  =========================================//
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new Error('User not found', { cause: 400 }))
    }
    const resetCode = Math.floor(Math.random() * 900000) + 100000;
    user.resetCode=resetCode
    await user.save()
    const message = `<p>Your Reset Password Code Is: ${resetCode}</p>`;
    const sentEmail = await sendEmail({
        to: email,
        subject: 'Reset Your Password',
        message
    })
    if (!sentEmail) {
        return next(new Error('Error Sending Email', { cause: 500 }))
    }
    res.status(200).json({ message: 'Email Sent!' })
}
//=========================================  End Forgetpassword  =========================================//
//=========================================  Start Resetpassword  =========================================//
export const ResetPassword = async (req, res, next) => {
    const { resetCode, password } = req.body;
    const user = await UserModel.findOne({ resetCode});
    if (!user) return next(new Error('User not found', { cause: 500 }))
    if (resetCode !== user.resetCode) return next(new Error('Invalid or expired reset code', { cause: 500 }))
    const hashedPassword = HashingFunction({ payload: password })
    await UserModel.findOneAndUpdate({ resetCode }, { resetCode:"", password: hashedPassword })
    res.status(200).json({ message: "Password Reset Done, Please Login" })
}
//=========================================  End Resetpassword  =========================================//
//=========================================  Start Logout  =========================================//
export const logout = async (req, res, next) => {
    const { _id } = req.user
    const user = await UserModel.findByIdAndUpdate(_id, { isLoggedIn: false })
    if (user) return res.status(200).json({ message: "Logged Out" })
    next(new Error("Cannot LogOut"))
}
//=========================================  End Logout  =========================================//

