const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  attributes: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
