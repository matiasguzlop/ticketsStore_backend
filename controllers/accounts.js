/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const Account = require('../models/Account');
const handleErrors = require('./utils/handleErrors');
const APIError = require('./utils/APIError');
const { hashPassword, verifyPassword } = require('./utils/hashing');
const AllowedUser = require('../models/AllowedUser');
const Cart = require('../models/Cart');

const createAccount = async (req, res) => {
  try {
    const data = req.body;
    const { email } = data;
    const allowedUser = await AllowedUser.findOne({ email });
    if (allowedUser) {
      const newAccount = new Account(data);
      const response = await newAccount.save();
      const justCreatedAccountId = response._id;
      const newCart = new Cart({ userId: justCreatedAccountId }); // this is not the best approach but design is not optimal. Have to be refactorized in future.
      const userCart = await newCart.save();
      await Account.findByIdAndUpdate(justCreatedAccountId, { cartId: userCart._id });
      res.status(201).json({ message: response });
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await Account.findById(id).select('_id email name attributes createdAt updatedAt');
    if (response) {
      res.status(200).json({ message: response });
    } else {
      throw new APIError(0);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { id, data } = req.body;
    if ('password' in data) {
      data.password = await hashPassword(data.password);
      // TODO: send email to confirm password update
    }
    const response = await Account.findByIdAndUpdate(id, data);
    if (response) {
      res.status(200).json({ message: response });
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const removeById = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Account.findByIdAndDelete(id);
    if (response) {
      res.status(200).json({ message: response });
    } else {
      throw new APIError(0);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ email });
    if (user === null) throw new APIError(1);
    const passwordVerification = await verifyPassword(password, user.password);
    if (passwordVerification) {
      user.password = null;
      req.session.user = user;
      res.status(200).end();
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const isLogged = async (req, res) => {
  try {
    const { user } = req.session;
    if (user) {
      res.status(200).json({ message: { user } });
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).end();
  } catch (error) {
    handleErrors(error, res);
  }
};

module.exports = {
  createAccount,
  getById,
  updateById,
  removeById,
  login,
  isLogged,
  logout,
};
