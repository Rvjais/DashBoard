import mongoose from 'mongoose';

const departments = ['web','seo','social','graphics'];
const roles = ['employee','manager','admin'];

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },     // unique index here
  username: { type: String, required: true, unique: true },  // unique index here
  passwordHash: { type: String, required: true },
  department: { type: String, enum: departments, default: 'web' },
  role: { type: String, enum: roles, default: 'employee' },
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
