import { TryCatch } from "./error.middleware.js";
import { ApiError } from "../utils/ApiError.js";
export const hasRole = (requiredRole: string[]) => {
    return TryCatch(async (req, res, next) => {
        const user = req.user;
        console.log("user in hasRole func: ", user)
        if (!user || !requiredRole.includes(user.role)) {
            throw new ApiError(403, "Forbidden: Insufficient permissions");
        }
        next();
    });
};