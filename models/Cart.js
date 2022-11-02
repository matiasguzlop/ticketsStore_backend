const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  products: [{
    productId: mongoose.SchemaTypes.ObjectId,
    qty: Number,
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
