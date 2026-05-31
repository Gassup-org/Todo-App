import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

interface SignPayload {
  sub: string;
  email: string;
  role: Role;
  name?: string | null;
}

export const tokenService = {
  sign(payload: SignPayload) {
    const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }
};
