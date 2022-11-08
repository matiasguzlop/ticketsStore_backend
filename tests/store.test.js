const supertest = require('supertest-session');
const { app } = require('../index');

const api = supertest(app);
const Store = require('../models/Store');
const { createStore } = require('./helpers');

beforeEach(async () => {
  await Store.deleteMany({});
});

test('Read store test, if not created, create it and set it to open', async () => {
  const { status, body } = await api.get('/store/state');
  expect(status).toBe(201);
  expect(body.message.open).toBe(true);
});

test('Read existent store state', async () => {
  await createStore();
  const { status, body } = await api.get('/store/state');
  expect(status).toBe(200);
  expect(body.message.open).toBe(true);
});

test('Create store and set it to open', async () => {
  const { status } = await api.post('/store/state').send({ open: true });
  expect(status).toBe(201);
  const result = await Store.find({});
  expect(result[0].open).toBe(true);
});

test('Open existent store', async () => {
  await createStore();
  const { status } = await api.post('/store/state').send({ open: true });
  expect(status).toBe(200);
  const result = await Store.find({});
  expect(result).toHaveLength(1);
  expect(result[0].open).toBe(true);
});

test('Create store and set it to closed', async () => {
  const { status } = await api.post('/store/state').send({ open: false });
  expect(status).toBe(201);
  const result = await Store.find({});
  expect(result[0].open).toBe(false);
});

test('Close existen store', async () => {
  await createStore();
  const { status } = await api.post('/store/state').send({ open: false });
  expect(status).toBe(200);
  const result = await Store.find({});
  expect(result[0].open).toBe(false);
});
