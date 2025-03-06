import prisma from "../utils/client.js";
import { setOrderCode } from "../utils/documentPattern.js";
import { logger } from "../utils/winston.js";
import { purchaseValidation } from "../validations/purchase.validation.js";
import fs from "fs";
import pdf from "pdf-creator-node";
import excelJS from "exceljs";

export const createPurchase = async (req, res) => {
  try {
    // validasi data
    const { error, value } = purchaseValidation(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        result: null,
      });
    }
    // create prisma transaction
    await prisma.$transaction(async (prisma) => {
      // insert purchase
      const purchase = await prisma.purchase.create({
        data: {
          code: setOrderCode("PUR-"),
          date: value.date,
          note: value.note,
          total: Number(value.total),
          ppn: Number(value.ppn),
          grandTotal: Number(value.grandTotal),
          userId: Number(value.userId),
        },
      });
      // validasi purchase detail
      if (value.detail.length <= 0) {
        return res.status(400).json({
          message: "purchase detail cannot be empty",
          result: null,
        });
      }
      // insert purchase detail
      for (let i = 0; i < value.detail.length; i++) {
        // check product exists
        if (
          value.detail[i].product.productId == "" ||
          value.detail[i].product.productId == null
        ) {
          throw new Error("product cannot be empty");
        }
        // check qty
        if (value.detail[i].qty == "" || value.detail[i].qty == null) {
          throw new Error("qty cannot be empty");
        }
        // insert purchase detail
        await prisma.purchasedetail.create({
          data: {
            productId: Number(value.detail[i].product.productId),
            productName: value.detail[i].product.productName,
            price: Number(value.detail[i].price),
            qty: Number(value.detail[i].qty),
            total: Number(value.detail[i].totalPrice),
            purchaseId: Number(purchase.id),
          },
        });
        // update stock
        await prisma.product.update({
          where: {
            id: Number(value.detail[i].product.productId),
          },
          data: {
            qty: {
              increment: Number(value.detail[i].qty),
            },
          },
        });
      }
    });
    return res.status(200).json({
      message: "success",
      result: value,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:createPurchase - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllPurchase = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  let result = [];
  try {
    if (last_id < 1) {
      result = await prisma.$queryRaw`
        SELECT 
              p.id, p.code, p.date, p.note, p.userId, u.name 
          FROM  Purchase p 
          INNER JOIN  User u 
          ON p.userId = u.id
          WHERE 
              p.code LIKE CONCAT('%', ${search}, '%')
              OR p.date LIKE CONCAT('%', ${search}, '%')
              OR p.note LIKE CONCAT('%', ${search}, '%')
              OR u.name LIKE CONCAT('%', ${search}, '%')
          ORDER BY 
              p.id DESC 
          LIMIT ${limit};
      `;
    } else {
      result = await prisma.$queryRaw`
         SELECT 
            p.id, p.code, p.date, p.note, p.userId, u.name 
        FROM  Purchase p 
        INNER JOIN User u 
        ON p.userId = u.id
        WHERE 
            (
              p.code LIKE CONCAT('%', ${search}, '%')
              OR p.date LIKE CONCAT('%', ${search}, '%')
              OR p.note LIKE CONCAT('%', ${search}, '%')
              OR u.name LIKE CONCAT('%', ${search}, '%')
            )
            AND p.id < ${last_id}
        ORDER BY 
            p.id DESC 
        LIMIT ${limit};`;
    }
    return res.status(200).json({
      message: "success",
      result: result,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:getAllPurchase - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  }
};

export const getPurchaseById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await prisma.purchase.findUnique({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        Purchasedetail: true,
      },
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      message: "success",
      result: result,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:getPurchaseById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const generatePdf = async (req, res) => {
  let pathFile = "./public/pdf";
  let fileName = "purchase.pdf";
  let fullPath = pathFile + "/" + fileName;
  let html = fs.readFileSync("./src/templates/PurchaseTemplate.html", "utf-8");
  let options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "0.1mm",
      // contents: '<div style="text-align: center;">Author: Pojok Code</div>',
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
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (isNaN(startDate) && isNaN(endDate)) {
      return res.status(400).json({
        message: "Invalid date format",
        result: null,
      });
    }
    const data = await prisma.purchase.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        Purchasedetail: true,
      },
    });
    let purchases = [];
    data.forEach((order, no) => {
      purchases.push({
        no: no + 1,
        code: order.code,
        date: new Date(order.date).toLocaleDateString("id-ID"),
        total: Number(order.total).toLocaleString("id-ID"),
        ppn: Number(order.ppn).toLocaleString("id-ID"),
        grandTotal: Number(order.grandTotal).toLocaleString("id-ID"),
        user: order.user.name,
        purchasedetail: order.Purchasedetail,
      });
    });
    let document = {
      html: html,
      data: {
        purchases: purchases,
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
      "controllers/purchase.controller.js:generatePdf - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const generateExcel = async (req, res) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Purchase");
  const path = "./public/excel";
  try {
    if (fs.existsSync(`${path}/Purchase.xlsx`)) {
      fs.unlinkSync(`${path}/Purchase.xlsx`);
    }
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (isNaN(startDate) && isNaN(endDate)) {
      return res.status(400).json({
        message: "Invalid date format",
        result: null,
      });
    }
    const data = await prisma.$queryRaw`
    SELECT  o.code, o.date,o.note, o.total,o.ppn,o.grandTotal,d.productName,d.price,
    d.qty, (d.price*d.qty) as totalPrice from Purchase o 
    INNER JOIN Purchasedetail d ON(d.purchaseId=o.id)
    WHERE o.date BETWEEN ${startDate} AND ${endDate}`;
    worksheet.columns = [
      { header: "No", key: "s_no", width: 5 },
      { header: "Date", key: "date", width: 15 },
      { header: "Code", key: "code", width: 20 },
      { header: "Total", key: "total", width: 25 },
      { header: "PPN", key: "ppn", width: 20 },
      { header: "Grand Total", key: "grandTotal", width: 20 },
      { header: "Product Name", key: "productName", width: 50 },
      { header: "Price", key: "price", width: 25 },
      { header: "QTY", key: "qty", width: 20 },
      { header: "Total Price", key: "totalPrice", width: 30 },
    ];
    let counter = 1;
    data.map((purchase) => {
      purchase.s_no = counter;
      purchase.total = Number(purchase.total).toLocaleString("id-ID");
      purchase.ppn = Number(purchase.ppn).toLocaleString("id-ID");
      purchase.grandTotal = Number(purchase.grandTotal).toLocaleString("id-ID");
      purchase.price = Number(purchase.price).toLocaleString("id-ID");
      purchase.qty = Number(purchase.qty).toLocaleString("id-ID");
      purchase.totalPrice = Number(purchase.totalPrice).toLocaleString("id-ID");
      worksheet.addRow(purchase);
      counter++;
    });
    let list = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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
    await workbook.xlsx.writeFile(`${path}/Purchase.xlsx`);
    return res.status(200).json({
      message: "success",
      result: `/excel/Purchase.xlsx`,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:generateExcel - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const purchaseYearly = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  try {
    const result = await prisma.$queryRaw`
    SELECT 
        IFNULL(SUM(CASE WHEN MONTH(date) = 1 THEN grandTotal ELSE 0 END), 0) AS purchase_01,
        IFNULL(SUM(CASE WHEN MONTH(date) = 2 THEN grandTotal ELSE 0 END), 0) AS purchase_02,
        IFNULL(SUM(CASE WHEN MONTH(date) = 3 THEN grandTotal ELSE 0 END), 0) AS purchase_03,
        IFNULL(SUM(CASE WHEN MONTH(date) = 4 THEN grandTotal ELSE 0 END), 0) AS purchase_04,
        IFNULL(SUM(CASE WHEN MONTH(date) = 5 THEN grandTotal ELSE 0 END), 0) AS purchase_05,
        IFNULL(SUM(CASE WHEN MONTH(date) = 6 THEN grandTotal ELSE 0 END), 0) AS purchase_06,
        IFNULL(SUM(CASE WHEN MONTH(date) = 7 THEN grandTotal ELSE 0 END), 0) AS purchase_07,
        IFNULL(SUM(CASE WHEN MONTH(date) = 8 THEN grandTotal ELSE 0 END), 0) AS purchase_08,
        IFNULL(SUM(CASE WHEN MONTH(date) = 9 THEN grandTotal ELSE 0 END), 0) AS purchase_09,
        IFNULL(SUM(CASE WHEN MONTH(date) = 10 THEN grandTotal ELSE 0 END), 0) AS purchase_10,
        IFNULL(SUM(CASE WHEN MONTH(date) = 11 THEN grandTotal ELSE 0 END), 0) AS purchase_11,
        IFNULL(SUM(CASE WHEN MONTH(date) = 12 THEN grandTotal ELSE 0 END), 0) AS purchase_12
    FROM purchase
    WHERE YEAR(date) = ${year}`;
    let arry = [];
    result.map((item) => {
      arry.push(
        ...arry,
        Number(item.purchase_01),
        Number(item.purchase_02),
        Number(item.purchase_03),
        Number(item.purchase_04),
        Number(item.purchase_05),
        Number(item.purchase_06),
        Number(item.purchase_07),
        Number(item.purchase_08),
        Number(item.purchase_09),
        Number(item.purchase_10),
        Number(item.purchase_11),
        Number(item.purchase_12)
      );
    });
    return res.status(200).json({
      message: "success",
      result: arry,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:purchaseYearly - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};