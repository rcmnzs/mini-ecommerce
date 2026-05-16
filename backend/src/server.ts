import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));

// ─── Middlewares ──────────────────────────────────────────────────────────────

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/v1', router);

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use(errorHandler);

export default app;
