const Account = require('../models/Account');
const handleErrors = require('./utils/handleErrors');
const APIError = require('./utils/APIError');

const createAccount = async (req, res) => {
  try {
    const data = req.body;
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
    const response = await Account.findById(id);
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
    if (!user) throw Error({ code: 1 });
    if (user.password === password) {
      res.redirect('/');
    } else {
      throw new APIError(1);
    }
  } catch (error) {
    console.log('code', error);
    handleErrors(error, res);
  }
};

module.exports = {
  createAccount,
  getById,
  updateById,
  removeById,
  login,
};
