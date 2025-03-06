import prisma from "../utils/client.js";
import { setOrderCode } from "../utils/documentPattern.js";
import { logger } from "../utils/winston.js";
import prism from "@prisma/client";
import fs from "fs";
import pdf from "pdf-creator-node";
import excelJS from "exceljs";

export const insertOrder = async (req, res) => {
    try {
        const data = await prisma.$transaction(async (prisma) => {
            // insert order
            const post = await prisma.orders.create({
                data: {
                    code: setOrderCode("ORD-"),
                    date: req.body.date,
                    total: req.body.total,
                    ppn: req.body.ppn,
                    grandTotal: req.body.grandTotal,
                    userId: Number(req.params.userId),
                },
            });
            // insert detail
            for (let i = 0; i < req.body.detail.length; i++) {
                await prisma.orderdetail.create({
                    data: {
                        price: req.body.detail[i].price,
                        productName: req.body.detail[i].productName,
                        qty: req.body.detail[i].qty,
                        totalPrice: req.body.detail[i].totalPrice,
                        note: req.body.detail[i].note,
                        orderId: post.id,
                        productId: req.body.detail[i].productId,
                    },
                });
                // update stock
                await prisma.product.update({
                    where: {
                        id: req.body.detail[i].productId,
                    },
                    data: {
                        qty: {
                            decrement: req.body.detail[i].qty,
                        },
                    },
                });
            }
            // delete cart
            await prisma.carts.deleteMany({
                where: {
                    userId: Number(req.params.userId),
                },
            });
            return post;
        });
        return res.status(200).json({
            message: "sukses memproses menu!",
            result: data,
        });
    } catch (error) {
        logger.error(
            "controllers/order.controller.js:insertOrder - " + error.message
        );
        return res.status(500).json({
            message: error.message,
            result: null,
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const result = await prisma.orders.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include: {
                Orderdetail: true,
            },
        });
        return res.status(200).json({
            message: "success",
            result,
        });
    } catch (error) {
        logger.error(
            "controllers/order.controller.js:getOrderById - " + error.message
        );
        return res.status(500).json({
            message: error.message,
            result: null,
        });
    }
};

export const getAllOrder = async (req, res) => {
    const last_id = parseInt(req.query.lastId) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    let result = [];
    try {
        if (last_id < 1) {
            result = await prisma.$queryRaw(
                prism.sql`SELECT id, code, date, total, ppn, grandTotal
          FROM orders
          WHERE (
            code LIKE CONCAT('%', ${search}, '%')
            OR date LIKE CONCAT('%', ${search}, '%')
            OR total LIKE CONCAT('%', ${search}, '%')
            OR ppn LIKE CONCAT('%', ${search}, '%')
            OR grandTotal LIKE CONCAT('%', ${search}, '%')
          )
          ORDER BY id DESC 
          LIMIT ${limit};`
            );
        } else {
            result = await prisma.$queryRaw(
                prism.sql`SELECT id, code, date, total, ppn, grandTotal
          FROM Orders 
          WHERE (
            code LIKE CONCAT('%', ${search}, '%')
            OR date LIKE CONCAT('%', ${search}, '%')
            OR total LIKE CONCAT('%', ${search}, '%')
            OR ppn LIKE CONCAT('%', ${search}, '%')
            OR grandTotal LIKE CONCAT('%', ${search}, '%')
          )
        AND id < ${last_id}
        ORDER BY id DESC 
        LIMIT ${limit};`
            );
        }
        return res.status(200).json({
            message: "success",
            result,
        });
    } catch (error) {
        logger.error(
            "controllers/order.controller.js:getAllOrder - " + error.message
        );
        return res.status(500).json({
            message: error.message,
            result: null,
        });
    }
};

export const generatePdf = async (req, res) => {
    try {
        let pathFile = "./public/pdf";
        let fileName = "order.pdf"; // Nama file tetap sama
        let fullPath = `${pathFile}/${fileName}`;
        let html = fs.readFileSync("./src/templates/SalesTemplate.html", "utf-8");

        let options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: { height: "0.1mm", contents: "" },
            footer: { height: "28mm", contents: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>' },
        };

        // Ambil tanggal dari request
        const startDate = new Date(req.body.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(req.body.endDate);
        endDate.setHours(23, 59, 59, 999);

        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ message: "Invalid date format", result: null });
        }

        // Ambil data terbaru dari database
        const data = await prisma.orders.findMany({
            where: { date: { gte: startDate, lte: endDate } },
            include: {
                user: { select: { name: true } },
                Orderdetail: true,
            },
            orderBy: { date: "desc" },
        });
        // Format data untuk template
        let orders = data.map((order, index) => ({
            no: index + 1,
            code: order.code,
            date: new Date(order.date).toLocaleDateString("id-ID"),
            total: Number(order.total).toLocaleString("id-ID"),
            ppn: Number(order.ppn).toLocaleString("id-ID"),
            grandTotal: Number(order.grandTotal).toLocaleString("id-ID"),
            user: order.user.name,
            orderdetail: order.Orderdetail,
        }));
        let document = {
            html: html,
            data: { orders: orders },
            path: fullPath,
            type: "",
        };
        // Hapus file lama sebelum membuat yang baru dengan nama yang sama
        if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
        }
        // Generate PDF
        await pdf.create(document, options);
        return res.status(200).json({
            message: "success",
            result: `/pdf/${fileName}`, // Nama file tetap sama
        });
    } catch (error) {
        logger.error(
            "controllers/product.controller.js:generatePdf - " + error.message
        );
        return res.status(500).json({ message: error.message, result: null });
    }
};

export const generateExcel = async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Order");
    const path = "./public/excel";
    try {
        if (fs.existsSync(`${path}/Order.xlsx`)) {
            fs.unlinkSync(`${path}/Order.xlsx`);
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
      SELECT  o.code, o.date, o.total,o.ppn,o.grandTotal,d.productName,d.price,
      d.qty, d.totalPrice from Orders o
      INNER JOIN Orderdetail d ON(d.orderId=o.id)
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
        data.map((order) => {
            order.s_no = counter;
            order.total = Number(order.total).toLocaleString("id-ID");
            order.ppn = Number(order.ppn).toLocaleString("id-ID");
            order.grandTotal = Number(order.grandTotal).toLocaleString("id-ID");
            order.price = Number(order.price).toLocaleString("id-ID");
            order.qty = Number(order.qty).toLocaleString("id-ID");
            order.totalPrice = Number(order.totalPrice).toLocaleString("id-ID");
            worksheet.addRow(order);
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
        await workbook.xlsx.writeFile(`${path}/Order.xlsx`);
        return res.status(200).json({
            message: "success",
            result: `/excel/Order.xlsx`,
        });
    } catch (error) {
        logger.error(
            "controllers/product.controller.js:generateExcel - " + error.message
        );
        return res.status(500).json({
            message: error.message,
            result: null,
        });
    }
};

export const orderYearly = async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    try {
        const result = await prisma.$queryRaw`
      SELECT
        IFNULL(SUM(CASE WHEN MONTH(date) = 1 THEN grandTotal ELSE 0 END), 0) AS order_01,
        IFNULL(SUM(CASE WHEN MONTH(date) = 2 THEN grandTotal ELSE 0 END), 0) AS order_02,
        IFNULL(SUM(CASE WHEN MONTH(date) = 3 THEN grandTotal ELSE 0 END), 0) AS order_03,
        IFNULL(SUM(CASE WHEN MONTH(date) = 4 THEN grandTotal ELSE 0 END), 0) AS order_04,
        IFNULL(SUM(CASE WHEN MONTH(date) = 5 THEN grandTotal ELSE 0 END), 0) AS order_05,
        IFNULL(SUM(CASE WHEN MONTH(date) = 6 THEN grandTotal ELSE 0 END), 0) AS order_06,
        IFNULL(SUM(CASE WHEN MONTH(date) = 7 THEN grandTotal ELSE 0 END), 0) AS order_07,
        IFNULL(SUM(CASE WHEN MONTH(date) = 8 THEN grandTotal ELSE 0 END), 0) AS order_08,
        IFNULL(SUM(CASE WHEN MONTH(date) = 9 THEN grandTotal ELSE 0 END), 0) AS order_09,
        IFNULL(SUM(CASE WHEN MONTH(date) = 10 THEN grandTotal ELSE 0 END), 0) AS order_10,
        IFNULL(SUM(CASE WHEN MONTH(date) = 11 THEN grandTotal ELSE 0 END), 0) AS order_11,
        IFNULL(SUM(CASE WHEN MONTH(date) = 12 THEN grandTotal ELSE 0 END), 0) AS order_12
      FROM orders
      WHERE YEAR(date) = ${year}
    `;
        let arry = [];
        result.map((item) => {
            arry.push(
                ...arry,
                Number(item.order_01),
                Number(item.order_02),
                Number(item.order_03),
                Number(item.order_04),
                Number(item.order_05),
                Number(item.order_06),
                Number(item.order_07),
                Number(item.order_08),
                Number(item.order_09),
                Number(item.order_10),
                Number(item.order_11),
                Number(item.order_12)
            );
        });
        return res.status(200).json({
            message: "success",
            result: arry,
        });
    } catch (error) {
        logger.error(
            "controllers/order.controller.js:orderYearly - " + error.message
        );
        return res.status(500).json({
            message: error.message,
            result: null,
        });
    }
};