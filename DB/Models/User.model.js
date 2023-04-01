import { model, Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    resetCode: {type:String,default:""},
    isLoggedIn: { type: Boolean, default: false},
}, {
    timestamps: true
})
export const UserModel = model.User || model("User", userSchema)
