const Account = require('../models/Account');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const initialAccount = {
  email: 'matias@company.com',
  password: '12341234',
  attributes: 'user',
};

const adminAccount = {
  email: 'admin@company.com',
  password: '12341234',
  attributes: 'admin',
};

const product1 = {
  name: 'Gas de 15kg',
  price: 25000,
};

const cart1 = {
  userId: '',
  products: [],
};

const createAccount = async () => {
  const NewAccount = new Account(initialAccount);
  const { _id } = await NewAccount.save();
  return _id.toString();
};

const createProduct = async () => {
  const newProduct = new Product(product1);
  const { _id } = await newProduct.save();
  return _id.toString();
};

const createCart = async (accountId) => {
  const newCart = new Cart({ ...cart1, userId: accountId });
  const { _id } = await newCart.save();
  return _id.toString();
};

const createOrder = async (accountId, productId = null) => {
  let productIdReady = productId;
  if (productId === null) {
    productIdReady = await createProduct();
  }
  const newOrder = new Order({
    userId: accountId,
    products: [{
      productId: productIdReady,
      qty: 10,
    }],
    status: 'new', // "in process", "done"
  });
  const { _id } = await newOrder.save();
  return _id.toString();
};

module.exports = {
  initialAccount,
  adminAccount,
  product1,
  cart1,
  createAccount,
  createProduct,
  createCart,
  createOrder,
};
