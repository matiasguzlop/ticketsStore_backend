const Store = require('../models/Store');
const handleErrors = require('./utils/handleErrors');

const createStore = async (initialData) => {
  const newStore = new Store(initialData);
  const { _id } = await newStore.save();
  return _id;
};

const readState = async (req, res) => {
  try {
    const result = await Store.findOne({});
    if (result === null) {
      await createStore({ open: true });
      const result2 = await Store.findOne({});
      res.status(201).json({ message: result2 });
    } else {
      res.status(200).json({ message: result });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

const setState = async (req, res) => {
  try {
    const { open } = req.body;
    const store = await Store.findOne({});
    if (store === null) {
      await createStore({ open: true });
      const store2 = await Store.findOne({});
      store2.open = open;
      const result = await store2.save();
      res.status(201).json({ message: result });
    } else {
      store.open = open;
      const result = await store.save();
      res.status(200).json({ message: result });
    }
  } catch (error) {
    handleErrors(error, res);
  }
};

module.exports = {
  readState,
  setState,
};
