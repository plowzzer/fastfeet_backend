import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';
import authorize from '../util/auth';

describe('Deliverymen', () => {
  beforeEach(async () => {
    await truncate();
  });

  // it('should be able to register a avatar', async () => {
  //   const token = await authorize();

  //   const response = await request(app)
  //     .post('/files')
  //     .set({ Authorization: `Bearer ${token}` })
  //     .attach('file', './__tests__/files/avatar.jpg');

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('id');
  // });

  // it('should be able to register a deliveryman with avatar', async () => {
  //   const token = await authorize();

  //   const avatarResponse = await request(app)
  //     .post('/files')
  //     .set({ Authorization: `Bearer ${token}` })
  //     .attach('file', './__tests__/files/avatar.jpg');

  //   const deliveryman = await factory.attrs('Deliveryman', {
  //     avatar_id: avatarResponse.body.id,
  //   });

  //   const response = await request(app)
  //     .post('/deliverymen')
  //     .set({ Authorization: `Bearer ${token}` })
  //     .send(deliveryman);

  //   expect(response.body).toHaveProperty('id');
  // });

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

  it('should be able to response validation fails', async () => {
    const token = await authorize();

    const deliveryman = await factory.attrs('Deliveryman', {
      email: 'normalstring',
    });

    const response = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    expect(response.status).toBe(400);
  });

  it('should be response an error when user try to register a new user with an existing email', async () => {
    const token = await authorize();
    const deliveryman = await factory.attrs('Deliveryman');

    await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    const response = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(`${deliveryman.email} already registred`);
  });

  it('should be able to edit an deliveryman', async () => {
    const token = await authorize();
    const deliveryman = await factory.attrs('Deliveryman');

    const createdDeliveryman = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    const response = await request(app)
      .put(`/deliverymen/${createdDeliveryman.body.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ email: 'newEdited@email.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to edit an deliveryman due validation', async () => {
    const token = await authorize();
    const deliverymen = await factory.attrsMany('Deliveryman', 2, [
      { email: 'foo@foo.com' },
      { email: 'foo2@foo2.com' },
    ]);

    await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliverymen[0]);

    const deliveryman = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliverymen[1]);

    const responseValidation = await request(app)
      .put(`/deliverymen/${deliveryman.body.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ email: 'notAnEmail' });

    expect(responseValidation.status).toBe(400);
    expect(responseValidation.body.error).toBe('Validation Fails');
  });

  it('should not be able to edit an deliveryman with another deliverymen email', async () => {
    const token = await authorize();
    const deliverymen = await factory.attrsMany('Deliveryman', 2, [
      { email: 'foo@foo.com' },
      { email: 'foo2@foo2.com' },
    ]);

    await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliverymen[0]);

    const deliveryman = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliverymen[1]);

    const responseValidation = await request(app)
      .put(`/deliverymen/${deliveryman.body.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ email: 'notAnEmail' });

    expect(responseValidation.status).toBe(400);
    expect(responseValidation.body.error).toBe('Validation Fails');

    const responseEmail = await request(app)
      .put(`/deliverymen/${deliveryman.body.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ email: deliverymen[0].email });

    expect(responseEmail.status).toBe(400);
    expect(responseEmail.body.error).toBe(
      `${deliverymen[0].email} already registred`
    );
  });

  it('should not be able to edit an unexitent deliveryman', async () => {
    const token = await authorize();
    const deliverymen = await factory.attrs('Deliveryman');

    const response = await request(app)
      .put('/deliverymen/999999')
      .set({ Authorization: `Bearer ${token}` })
      .send({ name: deliverymen.name });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('There is no deliveryman with id 999999');
  });

  it('should be able to delete a deliveryman', async () => {
    const token = await authorize();
    const deliveryman = await factory.attrs('Deliveryman');

    const createdDeliveryman = await request(app)
      .post('/deliverymen')
      .set({ Authorization: `Bearer ${token}` })
      .send(deliveryman);

    const response = await request(app)
      .delete(`/deliverymen/${createdDeliveryman.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.res).toBe('Deliveryman is deleted');
  });

  it('should not be able to delete an unexitent deliveryman', async () => {
    const token = await authorize();

    const response = await request(app)
      .delete('/deliverymen/999999')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Deliverymen not found');
  });
});
