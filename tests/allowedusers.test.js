const supertest = require('supertest-session');
const { allowedUser1, createAllowedUser } = require('./helpers');
const { app } = require('../index');
const AllowedUser = require('../models/AllowedUser');

const api = supertest(app);

beforeEach(async () => {
  await AllowedUser.deleteMany({});
});

describe('CRUD operations on AllowedUsers', () => {
  test('Create an alloweduser', async () => {
    const { status, body } = await api.post('/allowedusers/new').send(allowedUser1);
    expect(status).toBe(201);
    expect(body.message).toHaveProperty('_id');
    const result = await AllowedUser.find({});
    expect(result[0].email).toBe(allowedUser1.email);
  });

  test('Read all allowedusers', async () => {
    await createAllowedUser();
    const { status, body } = await api.get('/allowedusers/all');
    expect(status).toBe(200);
    expect(body.message[0].email).toBe(allowedUser1.email);
  });

  test('Update an alloweduser', async () => {
    const newEmail = 'new@email.com';
    const toUpdateId = await createAllowedUser();
    const { status } = await api.post('/allowedusers/update')
      .send({ id: toUpdateId, data: { email: newEmail } });
    expect(status).toBe(200);
    const result = await AllowedUser.findById(toUpdateId);
    expect(result.email).toBe(newEmail);
  });

  test('Delete an alloweduser', async () => {
    const toDeleteId = await createAllowedUser();
    const { status } = await api.delete('/allowedusers/byId').send({ id: toDeleteId });
    expect(status).toBe(200);
    const result = await AllowedUser.find({});
    expect(result).toHaveLength(0);
  });
});
