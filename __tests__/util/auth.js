import request from 'supertest';

import factory from '../factories';
import app from '../../src/app';

const authorize = async () => {
  const user = await factory.attrs('User');

  await request(app)
    .post('/users')
    .send(user);

  const session = await request(app)
    .post('/sessions')
    .send({ email: user.email, password: user.password });

  const { token } = session.body;

  return token;
};

export default authorize;
