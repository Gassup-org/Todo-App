import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUser } from '../types/auth';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user: AuthUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
