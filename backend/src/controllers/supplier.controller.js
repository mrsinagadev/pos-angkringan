import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import { supplierValidation } from "../validations/supplier.validation.js";
import fs from "fs";
import pdf from "pdf-creator-node";
import excelJS from "exceljs";

export const getAllSupplier = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  let result = [];
  try {
    if (last_id < 1) {
      const searchPattern = `%${search}%`;
      result = await prisma.$queryRaw`
      SELECT id, firstName, lastName, phone, email, address 
      FROM Supplier 
      WHERE (
        CONCAT(firstName, ' ', lastName) LIKE ${searchPattern}
        OR phone LIKE ${searchPattern}
        OR email LIKE ${searchPattern}
        OR address LIKE ${searchPattern}
      )
      ORDER BY id DESC 
      LIMIT ${parseInt(limit, 10)}`;
    } else {
      const searchPattern = `%${search}%`;
      const lastId = parseInt(last_id, 10);
      const limitValue = parseInt(limit, 10);

      result = await prisma.$queryRaw`
      SELECT id, firstName, lastName, phone, email, address 
      FROM Supplier 
      WHERE (
        CONCAT(firstName, ' ', lastName) LIKE ${searchPattern}
        OR phone LIKE ${searchPattern}
        OR email LIKE ${searchPattern}
        OR address LIKE ${searchPattern}
      )
      AND id < ${lastId}
      ORDER BY id DESC 
      LIMIT ${limitValue}`;
    }
    return res.status(200).json({
      message: "success",
      result,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:getAllSupplier - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const result = await prisma.supplier.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:getSupplierById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const createSupplier = async (req, res) => {
  const { error, value } = supplierValidation(req.body);
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.supplier.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email ? value.email : null,
        address: value.address,
      },
    });
    return res.status(200).json({
      message: "Data supplier berhasil ditambah!",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:createSupplier - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateSupplier = async (req, res) => {
  const { error, value } = supplierValidation(req.body);
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.supplier.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email ? value.email : null,
        address: value.address,
      },
    });
    return res.status(200).json({
      message: "Data supplier berhasil diubah!",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:updateSupplier - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const result = await prisma.supplier.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:deleteSupplier - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const generatePdf = async (req, res) => {
  let pathFile = "./public/pdf";
  let fileName = "supplier.pdf";
  let fullPath = pathFile + "/" + fileName;
  let html = fs.readFileSync("./src/templates/SupplierTemplate.html", "utf8");
  let options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "0.1mm",
      contents: "",
    },
    footer: {
      height: "28mm",
      contents: {
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
      },
    },
  };
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    const data = await prisma.supplier.findMany({});
    let suppliers = [];
    data.forEach((supplier, no) => {
      suppliers.push({
        no: no + 1,
        name:
          supplier.firstName +
          " " +
          (supplier.lastName ? supplier.lastName : ""),
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      });
    });
    let document = {
      html: html,
      data: {
        suppliers: suppliers,
      },
      path: fullPath,
      type: "",
    };
    const process = await pdf.create(document, options);
    if (process) {
      return res.status(200).json({
        message: "success",
        result: "/pdf/" + fileName,
      });
    }
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:generatePdf - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const generateExcel = async (req, res) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Supplier");
  const path = "./public/excel";
  try {
    if (fs.existsSync(`${path}/Supplier.xlsx`)) {
      fs.unlinkSync(`${path}/Supplier.xlsx`);
    }
    const data = await prisma.supplier.findMany({});
    worksheet.columns = [
      { header: "No", key: "s_no", width: 5 },
      { header: "Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 35 },
      { header: "Address", key: "address", width: 50 },
    ];
    let counter = 1;
    data.map((supplier) => {
      supplier.s_no = counter;
      supplier.name =
        supplier.firstName + " " + (supplier.lastName ? supplier.lastName : "");
      worksheet.addRow(supplier);
      counter++;
    });
    let list = ["A", "B", "C", "D", "E"];
    for (let i = 0; i <= counter; i++) {
      list.forEach((item) => {
        worksheet.getCell(item + i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    await workbook.xlsx.writeFile(`${path}/Supplier.xlsx`);
    return res.status(200).json({
      message: "success",
      result: `/excel/Supplier.xlsx`,
    });
  } catch (error) {
    logger.error(
      "controllers/supplier.controller.js:generateExcel - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};