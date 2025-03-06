import { verifyAccessToken } from "../utils/jwt.js";

export const autenticate = (req, res, next) => {
    let lanjut = 1;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        lanjut = 0;
        return res.status(401).json({
            message: "Verify token failed",
            result: null,
        });
    }
    const user = verifyAccessToken(token);
    if (!user) {
        lanjut = 0;
        return res.status(401).json({
            message: "Verify token failed",
            result: null,
        });
    }

    if (lanjut == 1) {
        req.user = user;
        next();
    }
};