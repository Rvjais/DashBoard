import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { connectDB } from './db/connect.js';
import authRoutes from './routes/auth.routes.js';
import workRoutes from './routes/work.routes.js';
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Core Express middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: config.corsOrigin, credentials: true }));

// Healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes (Express routers)
app.use('/api/auth', authRoutes);
app.use('/api/work', workRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Start
await connectDB(config.mongoUri);
app.listen(config.port, () => {
  console.log(`✅ Express API running on http://localhost:${config.port}`);
});
