import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGO_URI is missing');
  // Prevent OverwriteModelError / duplicate connects in dev
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(uri, {
    // You can add options if you want; mongoose v8 sets good defaults
    dbName: 'company_mgmt',
  });

  console.log('✅ Mongo connected');
  return mongoose.connection;
}
