import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof Error) {
    return res.status(500).json({ success: false, message: err.message });
  }

  return res.status(500).json({ success: false, message: 'Internal server error' });
};
