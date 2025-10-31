import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    // change these to the user you want to promote
    const phoneOrUsername = '9648165493';
    const user = await User.findOne({ $or: [{ phone: phoneOrUsername }, { username: phoneOrUsername }] });
    if (!user) { console.log('User not found'); process.exit(1); }

    user.role = 'admin';
    await user.save();
    console.log('✅ Promoted to admin:', { id: user._id.toString(), name: user.username, role: user.role, dept: user.department });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}
run();
