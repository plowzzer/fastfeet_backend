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

    // expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
