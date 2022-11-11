const AllowedUser = require('../models/AllowedUser');
const APIError = require('./utils/APIError');
const handleErrors = require('./utils/handleErrors');

const create = async (req, res) => {
  try {
    const data = req.body;
    const newAllowedUser = new AllowedUser(data);
    const result = await newAllowedUser.save();
    res.status(201).json({ message: result });
  } catch (error) {
    handleErrors(error, res);
  }
};

const readAll = async (req, res) => {
  try {
    const result = await AllowedUser.find({});
    res.status(200).json({ message: result });
  } catch (error) {
    handleErrors(error, res);
  }
};

const updateById = async (req, res) => {
  try {
    const { id, data } = req.body;
    const result = await AllowedUser.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json({ message: result });
  } catch (error) {
    console.log(error);
    handleErrors(error, res);
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await AllowedUser.findByIdAndDelete(id);
    if (result === null) throw new APIError(0);
    res.status(200).json({ message: result });
  } catch (error) {
    handleErrors(error, res);
  }
};

module.exports = {
  create,
  readAll,
  updateById,
  deleteById,
};
