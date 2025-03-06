import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";

export const createCart = async (req, res) => {
  try {
    const result = await prisma.carts.create({
      data: {
        price: req.body.price,
        productName: req.body.productName,
        qty: req.body.qty,
        totalPrice: req.body.totalPrice,
        note: req.body.note,
        productId: req.body.productId,
        userId: req.body.userId,
      },
    });
    res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:createCart - " + error.message
    );
    res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllCart = async (req, res) => {
  try {
    const result = await prisma.carts.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:getAllCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getCartByProductId = async (req, res) => {
  const param = req.params;
  try {
    const result = await prisma.carts.findMany({
      where: {
        productId: Number(param.id),
        userId: Number(param.userId),
      },
    });
    return res.status(200).json({
      message: "success",
      result: result[0],
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:getCartByProductId - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const result = await prisma.carts.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        price: Number(req.body.price),
        productName: req.body.productName,
        qty: Number(req.body.qty),
        totalPrice: Number(req.body.totalPrice),
        note: req.body.note,
        productId: Number(req.body.productId),
        userId: req.body.userId,
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:updateCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const result = await prisma.carts.delete({
      where: {
        id: Number(req.params.id),
        userId: Number(req.params.userId),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:deleteCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteAllCart = async (req, res) => {
  try {
    const result = await prisma.carts.deleteMany({
      where: {
        userId: Number(req.params.userId),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/cart.controller.js:deleteAllCart - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};