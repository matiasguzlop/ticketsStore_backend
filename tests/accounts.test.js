const supertest = require('supertest-session');
const app = require('../index');

const api = supertest(app);
const Account = require('../models/Account');

const {
  initialAccount,
} = require('./helpers');

beforeEach(async () => {
  await Account.deleteMany({});
});

describe('CRUD for accounts', () => {
  test('Create an account', async () => {
    const { status, body } = await api.post('/accounts/new').send(initialAccount);
    expect(status).toBe(201);
    expect(body).toHaveProperty('message');
    expect(body.message).toHaveProperty('_id');
  });

  test('Read an account', async () => {
    const NewAccount = new Account(initialAccount);
    const { _id: toReadId } = await NewAccount.save();
    const { status, body } = await api.get('/accounts/byId')
      .query({ id: toReadId.toString() });
    expect(status).toBe(200);
    expect(body).toHaveProperty('message');
    expect(body.message).toHaveProperty('email');
    expect(body.message.email).toBe(initialAccount.email);
  });

  test('Update an account', async () => {
    const NewAccount = new Account(initialAccount);
    const { _id: toUpdateId } = await NewAccount.save();
    const { status } = await api.post('/accounts/updateById')
      .send({ id: toUpdateId, data: { ...initialAccount, email: 'updatedEmail@company.com' } });
    // TODO: corner situations: hash new password!, check email company!
    expect(status).toBe(200);
    const response = await Account.findById(toUpdateId);
    expect(response.email).toBe('updatedEmail@company.com');
    expect(response.attributes).toBe(initialAccount.attributes);
  });

  test('Remove an account', async () => {
    const NewAccount = new Account(initialAccount);
    const { _id: toDeleteId } = await NewAccount.save();
    const { status } = await api.delete('/accounts/byId').send({ id: toDeleteId });
    expect(status).toBe(200);
    const response = await Account.findById(toDeleteId);
    expect(response).toBe(null);
  });

  test('Log in user', async () => {
    const NewAccount = new Account(initialAccount);
    await NewAccount.save();
    const { status, header } = await api.post('/accounts/login').send({ email: initialAccount.email, password: initialAccount.password });
    expect(status).toBe(302);
    expect(header.location).toBe('/');
  });

  test('Check logged in', async () => {
    const NewAccount = new Account(initialAccount);
    await NewAccount.save();
    await api.post('/accounts/login').send({ email: initialAccount.email, password: initialAccount.password });
    const { status } = await api.get('/accounts/isLogged');
    expect(status).toBe(200);
  });

  test('Logout user', async () => {
    const NewAccount = new Account(initialAccount);
    NewAccount.save();
    await api.post('/accounts/login').send({ email: initialAccount.email, password: initialAccount.password });
    const { status } = await api.post('/accounts/logout');
    expect(status).toBe(200);
    const { status: status2 } = await api.get('/accounts/isLogged');
    expect(status2).toBe(401);
  });
});
