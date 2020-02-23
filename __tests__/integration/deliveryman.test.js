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

  it('should be able to register a deliveryman without an avatar', async () => {
    const token = await authorize();
    const deliveryman = await factory.attrs('Deliveryman');

    const response = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    expect(response.body).toHaveProperty('id');
  });

  it('should be able to list deliverymen', async () => {
    const token = await authorize();
    const deliveryman = await factory.attrs('Deliveryman');

    await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    const response = await request(app)
      .get('/deliverymen')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should be able to detail a deliveryman', async () => {
    const token = await authorize();
    const deliveryman = await factory.attrs('Deliveryman');

    const responsePost = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    const response = await request(app)
      .get(`/deliverymen/${responsePost.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
  });

  it('should be able to response an error if the user id does not exists', async () => {
    const token = await authorize();

    const response = await request(app)
      .get(`/deliverymen/999999`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('There is no deliveryman with id 999999');
  });
});
