import { Router, Request, Response } from 'express';
import userRouter from './userRoutes';

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ─── Resources ────────────────────────────────────────────────────────────────

router.use('/users', userRouter);

export default router;
