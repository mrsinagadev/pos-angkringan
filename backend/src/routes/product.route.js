import { Router } from "express";
import { autenticate } from "../controllers/error.controller.js";
import {
  createProduct,
  deleteProduct,
  generateExcel,
  generatePdf,
  getAllProduct,
  getProductByCategory,
  getProductById,
  updateProduct
} from "../controllers/product.controller.js";
const productRoute = Router();

productRoute.post("/products", autenticate, createProduct);
productRoute.get("/products", autenticate, getAllProduct);
productRoute.get("/products/:id", autenticate, getProductById);
productRoute.get("/products/category/:id", autenticate, getProductByCategory);
productRoute.put("/products/:id", autenticate, updateProduct);
productRoute.delete("/products/:id", autenticate, deleteProduct);
productRoute.get("/products-pdf", autenticate, generatePdf);
productRoute.get("/products-excel", autenticate, generateExcel);

export default productRoute;