const supertest = require('supertest-session');
const { app } = require('../index');
const Account = require('../models/Account');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const {
  cart1, createAccount, createCart, createProduct,
} = require('./helpers');

const api = supertest(app);

let accountId;
beforeEach(async () => {
  await Product.deleteMany({});
  await Account.deleteMany({});
  await Cart.deleteMany({});
  accountId = await createAccount();
});

describe('CRUD for cart', () => {
  test('Create a cart', async () => {
    const { status } = await api.post('/carts/new').send({ ...cart1, userId: accountId });
    expect(status).toBe(201);
    const response = await Cart.find({});
    expect(response).toHaveLength(1);
  });

  test('Read a cart by userId', async () => {
    await createCart(accountId);
    const { status, body } = await api.get('/carts/byUserId')
      .query({ id: accountId });
    expect(status).toBe(200);
    expect(body.message.userId.toString()).toBe(accountId);
  });

  test('Add a new product to the cart', async () => {
    const toAddProductId = await createProduct();
    const toUpdateCartId = await createCart(accountId);
    const { status } = await api.post('/carts/addProduct')
      .send({
        cartId: toUpdateCartId,
        productId: toAddProductId,
        qty: 10,
      });
    expect(status).toBe(201);
    const cart = await Cart.findOne({});
    expect(cart.products[0].productId.toString()).toBe(toAddProductId);
    expect(cart.products[0].qty).toBe(10);
  });

  test('Add a product to the cart, if the product exists, add qty', async () => {
    const toAddProductId = await createProduct();
    const toUpdateCartId = await createCart(accountId);
    await api.post('/carts/addProduct').send({ cartId: toUpdateCartId, productId: toAddProductId, qty: 1 });
    const { status } = await api.post('/carts/addProduct')
      .send({
        cartId: toUpdateCartId,
        productId: toAddProductId,
        qty: 5,
      });
    expect(status).toBe(200);
    const cart = await Cart.findOne({});
    expect(cart.products).toHaveLength(1);
    expect(cart.products[0].productId.toString()).toBe(toAddProductId);
    expect(cart.products[0].qty).toBe(6);
  });

  test('Remove product from cart', async () => {
    const toDeleteProductId = await createProduct();
    const toDeleteCartId = await createCart(accountId);
    await api.post('/carts/updateProduct')
      .send({
        cartId: toDeleteCartId,
        productId: toDeleteProductId,
        qty: 5,
      });
    const { status } = await api.delete('/carts/deleteProduct')
      .send({
        cartId: toDeleteCartId,
        productId: toDeleteProductId,
      });
    expect(status).toBe(200);
    const response = await Cart.findOne({});
    expect(response.products).toHaveLength(0);
  });

  test('Remove all items from cart', async () => {
    const toDeleteProductId = await createProduct();
    const toDeleteCartId = await createCart(accountId);
    await api.post('/carts/updateProduct')
      .send({
        cartId: toDeleteCartId,
        productId: toDeleteProductId,
        qty: 5,
      });
    const { status } = await api.delete('/carts/empty')
      .send({
        cartId: toDeleteCartId,
      });
    expect(status).toBe(200);
    const response = await Cart.findOne({});
    expect(response.products).toHaveLength(0);
  });
});
