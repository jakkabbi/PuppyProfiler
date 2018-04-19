import * as mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  user: String,
  name: String,
  breed: String,
  birthday: String
});

const Dog = mongoose.model('Dog', dogSchema);

export default Dog;
