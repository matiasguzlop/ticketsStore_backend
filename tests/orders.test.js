/* eslint-disable no-underscore-dangle */
const supertest = require('supertest-session');
const { app } = require('../index');
const Account = require('../models/Account');
const Product = require('../models/Product');
const Order = require('../models/Order');

const {
  initialAccount, createProduct, createOrder,
} = require('./helpers');

const api = supertest(app);

let accountId;
beforeEach(async () => {
  await Product.deleteMany({});
  await Account.deleteMany({});
  await Order.deleteMany({});
  const newAccount = new Account(initialAccount);
  const { _id: newAccountId } = await newAccount.save();
  accountId = newAccountId.toString();
});

describe('CRUD for Orders', () => {
  test('Create an order', async () => {
    const productId = await createProduct();
    const { status, body } = await api.post('/orders/new')
      .send({
        userId: accountId,
        products: [{
          productId,
          qty: 10,
        }],
        status: 'new',
      });
    expect(status).toBe(201);
    expect(body.message).toHaveProperty('_id');
    const response = await Order.findById(body.message._id);
    expect(response.products[0].productId.toString()).toBe(productId);
  });

  test('Read an order by id', async () => {
    const productId = await createProduct();
    const toReadOrderId = await createOrder(accountId, productId);
    const { status, body } = await api.get('/orders/byId')
      .query({ id: toReadOrderId });
    expect(status).toBe(200);
    expect(body.message.products[0].productId.toString()).toBe(productId);
    expect(body.message.products[0].qty).toBe(10);
  });

  test('Read all orders by userId', async () => {
    await createOrder(accountId);
    const { status, body } = await api.get('/orders/byUserId').query({ id: accountId });
    expect(status).toBe(200);
    expect(body.message).toHaveLength(1);
  });

  test('Read all orders', async () => {
    await createOrder(accountId);
    const { status, body } = await api.get('/orders/all');
    expect(status).toBe(200);
    expect(body.message).toHaveLength(1);
  });

  test('Update order (only state)', async () => {
    const toUpdateOrderId = await createOrder(accountId);
    const { status } = await api.post('/orders/update')
      .send({ id: toUpdateOrderId, data: { status: 'in process' } });
    expect(status).toBe(200);
    const response = await Order.findById(toUpdateOrderId);
    expect(response.status).toBe('in process');
  });

  // REMOVE SHOULDN'T BE IMPLEMENTED
});
