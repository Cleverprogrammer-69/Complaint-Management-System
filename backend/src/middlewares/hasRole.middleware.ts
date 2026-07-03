import { TryCatch } from "./error.middleware.js";
import { ApiError } from "../utils/ApiError.js";
export const hasRole = (requiredRole: string[]) => {
    return TryCatch(async (req, res, next) => {
        const user = req.user;
        console.log(user.role)
        if (!requiredRole.includes(user.role)) {
            console.log("inside false cond")
            throw new ApiError(403, "Forbidden: Insufficient permissions");
        }
        console.log("granted")
        next();
    });
};