import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import PackagesController from './app/controllers/PackagesController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

// Deliveryman routes (detail, start and end of a delivery)
// No token needed
routes.get('/deliveryman/:deliveryman_id/deliveries', DeliveryController.index);
routes.post(
  '/deliveryman/:deliveryman_id/deliveries/:id',
  DeliveryController.create
);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:id',
  DeliveryController.update
);

// Delivery Problems
routes.get('/delivery/:id/problems', DeliveryProblemController.show);
routes.post('/delivery/:id/problems', DeliveryProblemController.create);

routes.get('/problems', DeliveryProblemController.index);
routes.delete('/problems/:id/cancel', DeliveryProblemController.delete);

// Needs to use the Token (only for administrators)
routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.details);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.destroy);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.details);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.destroy);

routes.get('/packages', PackagesController.index);
routes.get('/packages/:id', PackagesController.details);
routes.post('/packages', PackagesController.store);
routes.put('/packages/:id', PackagesController.update);
routes.delete('/packages/:id', PackagesController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
