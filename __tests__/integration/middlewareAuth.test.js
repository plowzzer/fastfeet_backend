import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';

describe('User', () => {
  it('should not be able to work, error is token invalid', async () => {
    const token = 'notAValidToken';
    const recipient = await factory.attrs('Recipient');

    const response = await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token invalid');
  });

  it('should not be able to work, error is token not provided', async () => {
    const recipient = await factory.attrs('Recipient');

    const response = await request(app)
      .post('/recipients')
      .send(recipient);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token not provided');
  });
});
