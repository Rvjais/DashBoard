import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  department:  { type: String, enum: ['web','seo','social','graphics','ads'], required: true },
  assignee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  status:      { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  // feedback threads
  feedback:    [{
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:  { type: String, required: true },
    createdAt:{ type: Date, default: Date.now }
  }],
  dueDate:     { type: Date }
}, { timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
