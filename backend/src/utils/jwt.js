import JsonWebToken from "jsonwebtoken";
import "dotenv/config";
import { logger } from "../utils/winston.js";

const generateAccessToken = (user) => {
    return JsonWebToken.sign(user,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "1800s",
    });
};

const generateRefreshToken = (user) => {
    return JsonWebToken.sign(user,process.env.JWT_REFRESH_SECRET,{
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "86400s",
    });
};

function verifyRefreshToken(token) {
    try {
        return JsonWebToken.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        logger.info("controllers/user.controller.js:verifyRefreshToken - " + err);
        return null;
    }
}

const parseJwt = (token) => {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

const verifyAccessToken = (token) => {
    try {
        return JsonWebToken.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        logger.info("controllers/user.controller.js:verifyRefreshToken - " + err);
        return null;
    }
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, parseJwt };