import * as express from 'express';

import DogCtrl from './controllers/dog';
import UserCtrl from './controllers/user';
import RoutineCtrl from './controllers/routine';
import Dog from './models/dog';
import User from './models/user';
import Routine from './models/routine';

export default function setRoutes(app) {

  const router = express.Router();

  const dogCtrl = new DogCtrl();
  const userCtrl = new UserCtrl();
  const routineCtrl = new RoutineCtrl();

  // Dogs
  router.route('/dogs/:user').get(dogCtrl.getAll);
  router.route('/dogs/count').get(dogCtrl.count);
  router.route('/dog').post(dogCtrl.insert);
  router.route('/dog/:id').get(dogCtrl.get);
  router.route('/dog/:id').put(dogCtrl.update);
  router.route('/dog/:id').delete(dogCtrl.delete);

  // Routine
  router.route('/routines/:dog').get(routineCtrl.getAll);
  router.route('/routines/count').get(routineCtrl.count);
  router.route('/routine').post(routineCtrl.insert);
  router.route('/routine/:id').get(routineCtrl.get);
  router.route('/routine/:id').put(routineCtrl.update);
  router.route('/routine/:id').delete(routineCtrl.delete);


  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
