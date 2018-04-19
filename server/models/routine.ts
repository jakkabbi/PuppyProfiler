import * as mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  dog: String,
  time: String,
  action: String,
  notes: String
});

const Routine = mongoose.model('Routine', routineSchema);

export default Routine;
