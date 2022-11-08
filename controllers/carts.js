const handleErrors = require('./utils/handleErrors');
const Cart = require('../models/Cart');
const APIError = require('./utils/APIError');

const newCart = async (req, res) => {
  try {
    const data = req.body;
    const cart = new Cart(data);
    const result = await cart.save();
    res.status(201).json({ message: result });
  } catch (error) {
    handleErrors(error, res);
  }
};

const getByUserId = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await Cart.findOne({ userId: id });
    if (result === null) {
      throw new APIError(0);
    } else {
      res.status(200).json({ message: result });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { cartId, productId, qty } = req.body;
    const cart = await Cart.findById(cartId);
    if (cart === null) throw new APIError(0);
    let productIndex;
    const productAlreadyExist = cart.products.some((item, index) => {
      if (item.productId.toString() === productId) {
        productIndex = index;
        return true;
      }
      return false;
    });
    let response; let status;
    if (productAlreadyExist) {
      // if product previously exists in this cart, update qty
      cart.products[productIndex] = { productId, qty };
      response = await cart.save();
      status = 200;
    } else {
      throw new APIError(0);
    }
    res.status(status).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const addProduct = async (req, res) => {
  try {
    const { cartId, productId, qty } = req.body;
    const cart = await Cart.findById(cartId);
    if (cart === null) throw new APIError(0);
    let productIndex;
    const productAlreadyExist = cart.products.some((item, index) => {
      if (item.productId.toString() === productId) {
        productIndex = index;
        return true;
      }
      return false;
    });
    let response; let status;
    if (productAlreadyExist) {
      // If product already exists, add provided qty to existent value
      const oldProduct = cart.products[productIndex];
      cart.products[productIndex] = { productId, qty: oldProduct.qty + qty };
      response = await cart.save();
      status = 200;
    } else {
      cart.products.push({ productId, qty });
      response = await cart.save();
      status = 201;
    }
    res.status(status).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    const cart = await Cart.findById(cartId);
    if (cart === null) throw new APIError(0);
    const newProducts = cart.products.filter((prod) => prod.productId.toString() !== productId);
    cart.products = newProducts;
    const response = await cart.save();
    res.status(200).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

const emptyCart = async (req, res) => {
  try {
    const { cartId } = req.body;
    const cart = await Cart.findById(cartId);
    if (cart === null) throw new APIError(0);
    cart.products = [];
    const response = await cart.save();
    res.status(200).json({ message: response });
  } catch (error) {
    handleErrors(error, res);
  }
};

module.exports = {
  newCart,
  getByUserId,
  updateProduct,
  deleteProduct,
  emptyCart,
  addProduct,
};
