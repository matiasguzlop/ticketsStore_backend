const XLSX = require('xlsx');
const Order = require('../models/Order');
const Product = require('../models/Product');
const APIError = require('./utils/APIError');
const handleErrors = require('./utils/handleErrors');
const groupBy = require('./utils/groupBy');

const newOrder = async (req, res) => {
  try {
    const { userId, products, status } = req.body;
    const productDataPromises = products.map(async (p) => Product.findById(p.productId));
    const productData = await Promise.all(productDataPromises);
    const total = productData.map((p, i) => p.price * products[i].qty)
      .reduce((prev, cur) => prev + cur);
    const order = new Order({
      userId,
      products,
      status,
      total,
    });
    const response = await order.save();
    res.status(201).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Order.findById(id);
    if (response === null) throw new APIError(0);
    res.status(200).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const getByUserId = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Order.find({ userId: id });
    if (response.length === 0) {
      throw new APIError(0);
    } else {
      res.status(200).json({ message: response });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const { from, to } = req.query;
    let response;
    if (from && to) {
      response = await Order.find({
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      });
    } else {
      response = await Order.find({});
    }
    res.status(200).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id, data } = req.body;
    const order = await Order.findById(id);
    order.status = data.status;
    const response = await order.save();
    res.status(200).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Order.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: result });
    } else {
      throw new APIError(0);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const exportExcel = async (req, res) => {
  // 1st table: get all orders and get all products on them, each row will be a product with its qty, username, order id, unit price and total price

  // 2nd table: get all products in orders and group them by productid, indicating all qty for a product.

  try {
    // TODO: return only PAID and PENDING orders, ignore CANCELLED and DELIVERED ones
    // const { from, to } = req.body;
    // console.log({ from }, { to });
    const orders = await Order.find({}).populate({
      path: 'products',
      populate: {
        path: 'productId',
        select: 'name price',
      },
    }).populate({
      path: 'userId',
      select: 'email',
    }); // TODO filter!
    if (orders.length === 0) throw new APIError(0);
    const rawData1 = orders
      .flatMap((order) => order.products
        .map((product) => (
          {
            productId: product.productId.id ?? 'producto no existente',
            productName: product.productId.name,
            productPrice: product.productId.price,
            qty: product.qty,
            userEmail: order.userId.email,
            userId: order.userId.id.toString(),
            orderId: order.id.toString(),
          }
        )));
    const headers = ['ID producto', 'Producto', 'Precio', 'Cantidad', 'Email cliente', 'ID cliente', 'ID orden'];
    const content = rawData1.map((row) => Object.values(row));
    const data1 = [headers, ...content];

    const data2Pre = [];
    const groupedRawData1 = groupBy(rawData1, 'productId');
    Object.keys(groupedRawData1)
      .forEach((key) => data2Pre.push(groupedRawData1[key]
        .reduce((prev, cur) => ({
          productId: cur.productId,
          productName: cur.productName,
          productPrice: cur.productPrice,
          qty: prev.qty + cur.qty,
          totalPrice: (prev.qty + cur.qty) * cur.productPrice,
        }), { qty: 0 })));

    const headers2 = ['ID Producto', 'Producto', 'Precio unitario', 'Cantidad', 'Precio total'];
    const content2 = data2Pre.map((row) => Object.values(row));
    const data2 = [headers2, ...content2];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data1), 'Productos por cliente');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data2), 'Productos agrupados');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');
    res.end(buf);
  } catch (error) {
    handleErrors(error, res);
  }
};

module.exports = {
  newOrder,
  getById,
  getByUserId,
  getAll,
  updateStatus,
  deleteById,
  exportExcel,
};
