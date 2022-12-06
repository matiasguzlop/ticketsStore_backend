const supertest = require('supertest-session');
const { app } = require('../index');

const api = supertest(app);
const Account = require('../models/Account');

const {
  initialAccount,
  createAccount,
} = require('./helpers');

beforeEach(async () => {
  await Account.deleteMany({});
});

describe('CRUD for accounts', () => {
  test('Create an account with a cart', async () => {
    const { status } = await api.post('/accounts/new').send(initialAccount);
    expect(status).toBe(201);
    const response = await Account.findOne({});
    expect(response.email).toBe(initialAccount.email);
    expect(response.cartId).not.toBe(undefined);
  });

  test('Read an account', async () => {
    const toReadId = await createAccount();
    const { status, body } = await api.get('/accounts/byId')
      .query({ id: toReadId });
    expect(status).toBe(200);
    expect(body).toHaveProperty('message');
    expect(body.message.email).toBe(initialAccount.email);
    expect(body.message).not.toHaveProperty('password');
  });

  test('Update an account', async () => {
    const toUpdateId = await createAccount();
    const { status } = await api.post('/accounts/updateById')
      .send({ id: toUpdateId, data: { email: 'updatedEmail@company.com' } });
    // TODO: corner situations: hash new password!, check email company!
    expect(status).toBe(200);
    const response = await Account.findById(toUpdateId);
    expect(response.email).toBe('updatedEmail@company.com');
    expect(response.attributes).toBe(initialAccount.attributes);
  });

  test('Remove an account', async () => {
    const toDeleteId = await createAccount();
    const { status } = await api.delete('/accounts/byId').send({ id: toDeleteId });
    expect(status).toBe(200);
    const response = await Account.findById(toDeleteId);
    expect(response).toBe(null);
  });

  test('Log in user', async () => {
    await createAccount();
    const { status } = await api.post('/accounts/login')
      .send({ email: initialAccount.email, password: initialAccount.password });
    expect(status).toBe(200);
  });

  test('Check logged in when is logged', async () => {
    await createAccount;
    await api.post('/accounts/login').send({ email: initialAccount.email, password: initialAccount.password });
    const { status, body } = await api.get('/accounts/isLogged');
    expect(status).toBe(200);
    expect(body.message.user.email).toBe(initialAccount.email);
    expect(body.message.user.attributes).toBe(initialAccount.attributes);
  });

  test('Check logged when is not logged', async () => {
    await createAccount;
    await api.post('/accounts/logout');
    const { status } = await api.get('/accounts/isLogged');
    expect(status).toBe(401);
    // expect(header.location).toBe('/login');
  });

  test('Logout user', async () => {
    await createAccount();
    await api.post('/accounts/login').send({ email: initialAccount.email, password: initialAccount.password });
    const { status } = await api.post('/accounts/logout');
    expect(status).toBe(200);
    const { status: status2 } = await api.get('/accounts/isLogged');
    expect(status2).toBe(401);
  });
});
