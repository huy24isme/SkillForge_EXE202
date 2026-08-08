import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import saRouter from './routes/sa.routes';
import publicRouter from './routes/public.routes';
import { initDbTables } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'system-admin-backend' });
});

// API Routes
app.use('/api/v1/sa', saRouter);
app.use('/api/v1/public', publicRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, async () => {
  await initDbTables();
  console.log(`🚀 System Admin Backend running on port ${PORT} (http://localhost:${PORT}/api/v1)`);
});
