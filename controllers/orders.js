const Order = require('../models/Order');
const Product = require('../models/Product');
const APIError = require('./utils/APIError');
const handleErrors = require('./utils/handleErrors');

const newOrder = async (req, res) => {
  try {
    const { userId, products, status } = req.body;
    const productDataPromises = products.map(async p => Product.findById(p.productId));
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
    const response = await Order.find({});
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

module.exports = {
  newOrder,
  getById,
  getByUserId,
  getAll,
  updateStatus,
};
