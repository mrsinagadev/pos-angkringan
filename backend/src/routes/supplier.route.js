import { Router } from "express";
import { autenticate } from "../controllers/error.controller.js";
import {
  createSupplier,
  deleteSupplier,
  generateExcel,
  generatePdf,
  getAllSupplier,
  getSupplierById,
  updateSupplier
} from "../controllers/supplier.controller.js";
const supplierRouter = Router();

supplierRouter.get("/suppliers", autenticate, getAllSupplier);
supplierRouter.get("/suppliers/:id", autenticate, getSupplierById);
supplierRouter.post("/suppliers", autenticate, createSupplier);
supplierRouter.put("/suppliers/:id", autenticate, updateSupplier);
supplierRouter.delete("/suppliers/:id", autenticate, deleteSupplier);
supplierRouter.get("/suppliers-pdf", autenticate, generatePdf);
supplierRouter.get("/suppliers-excel", autenticate, generateExcel);

export default supplierRouter;