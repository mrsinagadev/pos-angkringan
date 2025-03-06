// import { compare } from "bcrypt";
import { compare } from "bcrypt";
import { encript } from "../utils/bcript.js";
import prisma from "../utils/client.js";
import { generateAccessToken, generateRefreshToken, parseJwt, verifyRefreshToken } from "../utils/jwt.js";
import { logger } from "../utils/winston.js";
import {
  userUpdateValidation,
  userValidation
} from "../validations/user.validation.js";

export const createUser = async (req, res) => {
  const { error, value } = userValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.user.create({
      data: {
        name: value.name,
        userName: value.userName,
        password: encript(value.password),
        role: value.role,
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/user.controller.js:createUser - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      result: null,
    });
  }
  // data validation
  const { error, value } = userUpdateValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  let pass = user.password;
  if (value.password && value.password.length > 0) {
    pass = encript(value.password);
  }
  try {
    const result = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: value.name,
        userName: value.userName,
        password: pass,
        role: value.role,
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/user.controller.js:updateUser - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        userName: req.body.userName,
      },
    });
    if (result) {
      if (compare(req.body.password, result.password)) {
        // generate token
        result.password = "xxxxxxxxxxxxxxxxxx";
        const acessToken = generateAccessToken(result);
        const refreshToken = generateRefreshToken(result);
        return res.status(200).json({
          message: "Login Berhasil!",
          result,
          acessToken,
          refreshToken,
        });
      } else {
        return res.status(500).json({
          message: "password not match",
          result: null,
        });
      }
    } else {
      return res.status(500).json({
        message: "Maaf, Username atau Password salah!",
        result: null,
      });
    }
  } catch (error) {
    logger.error("controllers/user.controller.js:loginUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/user.controller.js:deleteUser - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const result = await prisma.user.findMany({});
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/user.controller.js:getAllUser - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/user.controller.js:getUserById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const setRefreshToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Verify token failed",
        result: null,
      });
    }
    const verify = verifyRefreshToken(token);
    if (!verify) {
      return res.status(401).json({
        message: "Verify token failed",
        result: null,
      });
    }
    let data = await parseJwt(token);
    const user = await prisma.user.findUnique({
      where: {
        userName: data.userName,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        result: null,
      });
    } else {
      user.password = "xxxxxxxxxxxxxxxxxx";
      const acessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      return res.status(200).json({
        message: "Refresh success",
        result: user,
        acessToken,
        refreshToken,
      });
    }
  } catch (error) {
    logger.error(
      "controllers/user.controller.js:setRefreshToken - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};