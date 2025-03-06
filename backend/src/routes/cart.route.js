import { Router } from "express";
import { autenticate } from "../controllers/error.controller.js";
import {
  createCart,
  deleteAllCart,
  deleteCart,
  getAllCart,
  getCartByProductId,
  updateCart,
} from "../controllers/cart.controller.js";
const cartRoute = Router();

cartRoute.post("/carts", autenticate, createCart);
cartRoute.get("/carts", autenticate, getAllCart);
cartRoute.get("/carts/product/:id/:userId", autenticate, getCartByProductId);
cartRoute.put("/carts/:id", autenticate, updateCart);
cartRoute.delete("/carts/:id/:userId", autenticate, deleteCart);
cartRoute.delete("/carts/:userId", autenticate, deleteAllCart);

export default cartRoute;