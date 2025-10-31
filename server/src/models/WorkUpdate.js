import mongoose from 'mongoose';

const workUpdateSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, enum: ['web','seo','social','graphics','ads'], required: true },
  title:      { type: String, required: true },
  description:{ type: String, default: '' },
  status:     { type: String, enum: ['todo','in-progress','done'], default: 'in-progress' },

  // NEW (optional) — lets us compute dashboard metrics
  metric:     { type: String, enum: ['pages','leads','gmb_calls','conversions'], required: false },
  value:      { type: Number, default: 1 },   // how many units this update represents
}, { timestamps: true });

const WorkUpdate = mongoose.models.WorkUpdate || mongoose.model('WorkUpdate', workUpdateSchema);
export default WorkUpdate;
