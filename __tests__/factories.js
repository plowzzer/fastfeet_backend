import faker from 'faker/locale/pt_BR';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Recipient from '../src/app/models/Recipient';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('UserFail', User, {
  name: faker.name.findName(),
  password: faker.internet.password(),
});

factory.define('Recipient', Recipient, {
  name: faker.name.findName(),
  street: `${faker.address.streetSuffix()} ${faker.address.streetAddress()}`,
  number: faker.address.streetPrefix(),
  complement: faker.address.secondaryAddress(),
  state: faker.address.stateAbbr(),
  city: faker.address.city(),
  cep: faker.address.zipCode(),
});

factory.define('RecipientFail', Recipient, {
  street: `${faker.address.streetSuffix()} ${faker.address.streetAddress()}`,
  number: faker.address.streetPrefix(),
  state: faker.address.stateAbbr(),
  city: faker.address.city(),
  cep: faker.address.zipCode(),
});

export default factory;
