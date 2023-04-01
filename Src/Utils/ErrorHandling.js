let stackLocation;
export const asyncHandler =  (API) => {
    return async (req, res, next)=>{
        API(req,res,next).catch((error) => {
            if (error.code == 11000) {
                stackLocation = error.stack;
                return res.status(409).json({
                    message: "Error Duplicated Data Found",
                    Error: error.message,
                    Stack: error.stack,
                });
            }
            stackLocation = error.stack;
            next(new Error(error.message, { cause: 400, Stack: stackLocation }))
        })
    }
}
export {stackLocation}