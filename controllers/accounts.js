const Account = require('../models/Account');
const handleErrors = require('./utils/handleErrors');
const APIError = require('./utils/APIError');
const { hashPassword, verifyPassword } = require('./utils/hashing');

const createAccount = async (req, res) => {
  try {
    const data = req.body;
    data.password = await hashPassword(data.password);
    const newAccount = new Account(data);
    const response = await newAccount.save();
    res.status(201).json({ message: response });
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
      throw APIError(0);
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
      req.session.user = user;
      res.redirect('/');
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const isLogged = async (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).end();
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
