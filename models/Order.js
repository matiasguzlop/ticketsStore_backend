const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Account',
    required: true,
  },
  products: [{
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
    },
    qty: Number,
  }],
  status: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: 'correlativeId' });
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
