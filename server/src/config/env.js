import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/company_mgmt',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
