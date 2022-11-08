const mongoose = require('mongoose');

const allowedUserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const AllowedUser = mongoose.model('alloweduser', allowedUserSchema);

module.exports = AllowedUser;
