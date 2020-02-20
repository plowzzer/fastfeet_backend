import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';

describe('Session', () => {
  it('should be able to get a token', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password });

    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to get a token becouse a validation', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email });

    expect(response.status).toBe(400);
  });

  it('should not be able get a user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'nouser@festfeet.com', password: '123456' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('User not found');
  });

  it('should not be able to get a token becouse a password error', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: 'somepassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Password does not match');
  });
});
