const mongoose = require('mongoose');
const { hashPassword } = require('../controllers/utils/hashing');

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
  token: { // TODO: controllers for this (used in newAccount, update password and password recovery)
    type: String,
    // required: true,
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

async function hashifyPasswordOnNewAccount(next) {
  try {
    const { password } = this;
    this.password = await hashPassword(password);
    next();
  } catch (error) {
    next(error);
  }
}
accountSchema.pre('save', hashifyPasswordOnNewAccount);
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
