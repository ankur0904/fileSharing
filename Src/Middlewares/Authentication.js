import { UserModel } from "../../DB/Models/User.model.js";
import { asyncHandler } from "../Utils/ErrorHandling.js";
import { tokenDecode } from "../Utils/TokenFunction.js";

const authFunction = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new Error("Token NotFound, Please Login", { cause: 400 }))
    }
    if (!authorization.startsWith(process.env.PREFIX)) {
        return next(new Error("Wrong Prefix ", { cause: 400 }));
    }
    const Token = authorization.split(process.env.PREFIX)[1]
    const decoded = tokenDecode({ payload: Token })
    if (!decoded?._id) {
        return next(new Error("Decoding Failed", { cause: 400 }));
    }
    const user = await UserModel.findById(decoded._id, "-password");
    if (!user) {
        return next(new Error("User Doesnot Exist Anymore", { cause: 400 }));
    }
    req.user = user;
    next();
}
export const auth = () => {
    return asyncHandler(authFunction);
};