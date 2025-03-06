import { Router } from "express";
import { autenticate } from "../controllers/error.controller.js";
import { insertOrderReturn } from "../controllers/orderReturn.controller.js";
const orderReturnRouter = Router();

orderReturnRouter.post("/order-returns", autenticate, insertOrderReturn);

export default orderReturnRouter;