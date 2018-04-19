import Routine from '../models/routine';
import BaseCtrl from './base';

export default class RoutineCtrl extends BaseCtrl {
  model = Routine;

  // Gets all dogs belonging to the logged in user
  getAll = (req, res) => {
    this.model.find({ dog: req.params._id }, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }
}
