const Product = require('../models/Product');
const APIError = require('./utils/APIError');
const handleErrors = require('./utils/handleErrors');

const newProduct = async (req, res) => {
  try {
    const data = req.body;
    const product = new Product(data);
    const response = await product.save();
    res.status(201).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Product.findById(id);
    if (response) {
      res.status(200).json({ message: response });
    } else {
      throw new APIError(0);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await Product.find({});
    if (response) {
      res.status(200).json({ message: response });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { id, data } = req.body;
    const response = await Product.findOneAndUpdate({ _id: id }, data, { new: true });
    if (response) {
      res.status(200).json({ message: response });
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Product.findByIdAndDelete(id);
    if (response) {
      res.status(200).json({ message: response });
    } else {
      throw new APIError(0);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

module.exports = {
  newProduct,
  getById,
  getAll,
  update,
  deleteById,
};
