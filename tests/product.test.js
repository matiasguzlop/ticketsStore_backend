const supertest = require('supertest-session');
const { app } = require('../index');

const api = supertest(app);
const Product = require('../models/Product');

const {
  product1,
  createProduct,
} = require('./helpers');

beforeEach(async () => {
  await Product.deleteMany({});
});

describe('CRUD for products', () => {
  test('Create a product', async () => {
    const { status, body } = await api.post('/products/new').send(product1);
    expect(status).toBe(201);
    expect(body.message).toHaveProperty('_id');
    const response = await Product.findOne({});
    expect(response.name).toBe(product1.name);
  });

  test('Read a product by id', async () => {
    const toReadId = await createProduct();
    const { status, body } = await api.get('/products/byId')
      .query({ id: toReadId });
    expect(status).toBe(200);
    expect(body.message.name).toBe(product1.name);
  });

  test('Read all products', async () => {
    await createProduct();
    await createProduct();
    const { status, body } = await api.get('/products/all');
    expect(status).toBe(200);
    expect(body.message).toHaveLength(2);
    expect(body.message[0].name).toBe(product1.name);
  });

  test('Update product', async () => {
    const toUpdateId = await createProduct();
    const { status } = await api.post('/products/update').send({ id: toUpdateId, data: { name: 'new name!' } });
    expect(status).toBe(200);
    const response = await Product.findOne({});
    expect(response.name).toBe('new name!');
  });

  test('Remove product', async () => {
    const toDeleteId = await createProduct();
    const { status } = await api.delete('/products/byId').send({ id: toDeleteId });
    expect(status).toBe(200);
    const response = await Product.find({});
    expect(response).toHaveLength(0);
  });
});
