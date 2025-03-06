import { Router } from "express";
import { autenticate } from "../controllers/error.controller.js";
import {
  createPurchase,
  generateExcel,
  generatePdf,
  getAllPurchase,
  getPurchaseById,
  purchaseYearly
} from "../controllers/purchase.controller.js";
const purchaseRouter = Router();

purchaseRouter.post("/purchases", autenticate, createPurchase);
purchaseRouter.get("/purchases", autenticate, getAllPurchase);
purchaseRouter.get("/purchases/:id", autenticate, getPurchaseById);
purchaseRouter.post("/purchases-pdf", autenticate, generatePdf);
purchaseRouter.post("/purchases-excel", autenticate, generateExcel);
purchaseRouter.get("/purchase-year", autenticate, purchaseYearly);

export default purchaseRouter;