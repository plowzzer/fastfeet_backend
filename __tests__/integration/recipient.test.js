import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';
import authorize from '../util/auth';

describe('Recipient', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register a recipient', async () => {
    const token = await authorize();
    const recipient = await factory.attrs('Recipient');

    const response = await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register due a validation', async () => {
    const token = await authorize();
    const recipient = await factory.attrs('RecipientFail');

    const response = await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Fails');
  });

  it('should be able to index the recipients', async () => {
    const token = await authorize();
    const recipient = await factory.attrs('Recipient');

    await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    const response = await request(app)
      .get('/recipients')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.body).toHaveLength(1);
  });

  it('should be able to detail a recipient', async () => {
    const token = await authorize();
    const recipient = await factory.attrs('Recipient');

    const recipientRes = await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    const response = await request(app)
      .get(`/recipients/${recipientRes.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to detail a non existing recipient', async () => {
    const token = await authorize();

    const response = await request(app)
      .get(`/recipients/NuN`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('There is no Recipient with id NuN');
  });

  // it('should not be able to register due a validation', async () => {
  //   const token = await authorize();
  //   const recipient = await factory.attrs('Recipient');

  //   const recipientRes = await request(app)
  //     .post('/recipients')
  //     .set({ Authorization: `Bearer ${token}` })
  //     .send(recipient);

  //   const response = await request(app)
  //     .put(`/recipients/${recipientRes.body.id}`)
  //     .set({ Authorization: `Bearer ${token}` })
  //     .send({ name: true });

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe('Validation Fails');
  // });

  it('should not be able to update a non existing recipient', async () => {
    const token = await authorize();
    const response = await request(app)
      .put(`/recipients/1`)
      .set({ Authorization: `Bearer ${token}` })
      .send({});

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Recipient not founded');
  });

  it('should be able to update recipient', async () => {
    const token = await authorize();
    const recipient = await factory.attrs('Recipient');

    const recipientRes = await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    const response = await request(app)
      .put(`/recipients/${recipientRes.body.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ name: 'Edited' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Edited');
  });

  it('should not be able to delete a non existing recipient', async () => {
    const token = await authorize();

    const response = await request(app)
      .delete(`/recipients/NuN`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Recipient not founded');
  });

  it('should be able to delete a recipient', async () => {
    const token = await authorize();
    const recipient = await factory.attrs('Recipient');

    const recipientRes = await request(app)
      .post('/recipients')
      .set({ Authorization: `Bearer ${token}` })
      .send(recipient);

    const response = await request(app)
      .delete(`/recipients/${recipientRes.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.res).toBe('Recipient is deleted');
  });
});
