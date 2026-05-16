import { Request, Response, NextFunction } from 'express';

// ─── Base Exception ───────────────────────────────────────────────────────────

export class AppException extends Error {
  public statusCode: number;
  public code: string;
  public details?: string;

  constructor(message: string, statusCode: number, code: string, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
  }
}

// ─── Custom Exceptions ────────────────────────────────────────────────────────

export class NotFoundException extends AppException {
  constructor(message = 'Recurso não encontrado', details?: string) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ConflictException extends AppException {
  constructor(message = 'Conflito de dados', details?: string) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class ValidationException extends AppException {
  constructor(message = 'Dados inválidos', details?: string) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class InternalException extends AppException {
  constructor(message = 'Erro interno do servidor', details?: string) {
    super(message, 500, 'INTERNAL_ERROR', details);
  }
}

// ─── Global Error Handler Middleware ─────────────────────────────────────────

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppException) {
    console.warn(`[${err.code}] ${err.message}`);
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        timestamp: new Date().toISOString(),
        path: req.path,
      },
    });
    return;
  }

  console.error('[INTERNAL_ERROR]', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
}
