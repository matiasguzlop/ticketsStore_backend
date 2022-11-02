const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  products: [{
    productId: mongoose.SchemaTypes.ObjectId,
    qty: Number,
  }],
  status: {
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

orderSchema.plugin(AutoIncrement, { inc_field: 'correlativeId' });
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
