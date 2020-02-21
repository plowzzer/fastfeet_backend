import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';
import authorize from '../util/auth';

describe('Deliverymen', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register a avatar', async () => {
    const token = await authorize();

    const response = await request(app)
      .post('/files')
      .set({ Authorization: `Bearer ${token}` })
      .attach('file', './__tests__/files/avatar.jpg');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to register a deliveryman with avatar', async () => {
    const token = await authorize();

    const avatarResponse = await request(app)
      .post('/files')
      .set({ Authorization: `Bearer ${token}` })
      .attach('file', './__tests__/files/avatar.jpg');

    const deliveryman = await factory.attrs('Deliveryman', {
      avatar_id: avatarResponse.body.id,
    });

    const response = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    expect(response.body).toHaveProperty('id');
  });
});
