import request from 'supertest';
import faker from 'faker';

import app from '../../src/app';
import factory from '../factories';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register a user', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register a user with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);
    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register becouse a validation input is blocking it', async () => {
    const user = await factory.attrs('UserFail');

    const response = await request(app)
      .post('/users')
      // .send({ name: 'teste' });
      .send(user);

    expect(response.status).toBe(400);
  });

  it('sould be able to update the user name', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const session = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    const { token } = session.body;

    const newName = faker.name.findName();
    const response = await request(app)
      .put('/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({ name: newName });

    expect(response.body.name).toBe(newName);
  });

  it('sould be not able to update the user name becouse a validation input is blocking it', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const session = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    const { token } = session.body;

    const newName = faker.name.findName();
    const response = await request(app)
      .put('/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({ name: newName, password: '' });

    expect(response.status).toBe(400);
  });

  it('sould be not able to update a user with a existent email', async () => {
    const users = await factory.attrsMany('User', 2, [
      { email: 'foo@foo.com' },
      { email: 'foo2@foo2.com' },
    ]);

    // Creating users
    await request(app)
      .post('/users')
      .send(users[0]);
    await request(app)
      .post('/users')
      .send(users[1]);

    const session = await request(app)
      .post('/sessions')
      .send({ email: users[0].email, password: users[1].password });

    const { token } = session.body;

    const response = await request(app)
      .put('/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({ email: users[1].email });

    expect(response.status).toBe(400);
  });

  it('sould be not able to update a user becouse a oldPassword verification', async () => {
    const user = await factory.attrs('User');

    // Creating users
    await request(app)
      .post('/users')
      .send(user);

    const session = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    const { token } = session.body;

    const response = await request(app)
      .put('/users')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        oldPassword: '1e9dhwsiaod',
        password: 'foofoo',
        confirmPassword: 'foofoo',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Password does not match');
  });
});
