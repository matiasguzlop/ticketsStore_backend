const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  open: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
