import { Request, Response } from 'express';
import { env } from '../config/env';
import { authService } from '../services/auth.service';
import { created, fail, ok } from '../utils/http';

const frontendLoginRedirect = (token: string) => {
  const url = new URL('/login', env.CLIENT_URL);
  url.searchParams.set('token', token);
  return url.toString();
};

export const authController = {
  googleRedirect(_req: Request, res: Response) {
    return res.redirect(authService.getGoogleLoginUrl());
  },

  async googleCallbackRedirect(req: Request, res: Response) {
    try {
      const code = String(req.query.code || '');
      if (!code) {
        return fail(res, 400, 'code query is required');
      }

      const result = await authService.loginWithGoogleCode(code);
      return res.redirect(frontendLoginRedirect(result.token));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      const url = new URL('/login', env.CLIENT_URL);
      url.searchParams.set('error', message);
      return res.redirect(url.toString());
    }
  },

  async googleUrl(_req: Request, res: Response) {
    const url = authService.getGoogleLoginUrl();
    return ok(res, { url });
  },

  async googleCallback(req: Request, res: Response) {
    try {
      const code = String(req.body.code || '');
      if (!code) {
        return fail(res, 400, 'code is required');
      }

      const result = await authService.loginWithGoogleCode(code);
      return created(res, result, 'Login successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return fail(res, 400, message);
    }
  },

  async me(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    const user = await authService.getCurrentUser(req.user.id);
    if (!user) {
      return fail(res, 404, 'User not found');
    }

    return ok(res, user);
  },

  logout(_req: Request, res: Response) {
    return ok(res, { loggedOut: true }, 'Logout successful');
  }
};
