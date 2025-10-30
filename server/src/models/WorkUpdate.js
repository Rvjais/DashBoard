import mongoose from 'mongoose';

const workUpdateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'in-progress' },
  },
  { timestamps: true }
);

const WorkUpdate = mongoose.models.WorkUpdate || mongoose.model('WorkUpdate', workUpdateSchema);
export default WorkUpdate;
