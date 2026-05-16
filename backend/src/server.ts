import 'dotenv/config';
import express from 'express';
import router from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ─── Middlewares ──────────────────────────────────────────────────────────────

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/v1', router);

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
