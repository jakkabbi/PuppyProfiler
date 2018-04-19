import Dog from '../models/dog';
import BaseCtrl from './base';

export default class DogCtrl extends BaseCtrl {
  model = Dog;

  // Gets all dogs belonging to the logged in user
  getAll = (req, res) => {
    this.model.find({ user: req.params.user }, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  }    
}
