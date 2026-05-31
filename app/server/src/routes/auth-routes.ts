import { Router } from 'express';
import passport from 'passport';
import { handleCurrentUser, handleGoogleCallback, handleLogout, handleTestLogin } from '../controllers/auth-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { setOAuthState, verifyOAuthState } from '../middlewares/oauth-state.js';
import { asyncHandler } from '../utils/async-handler.js';

export const authRoutes = Router();

authRoutes.get(
  '/auth/google',
  setOAuthState,
  (request, response, next) =>
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      state: response.locals.oauthState as string,
    })(request, response, next),
);

authRoutes.get(
  '/auth/google/callback',
  verifyOAuthState,
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  asyncHandler(handleGoogleCallback),
);

authRoutes.post('/auth/logout', asyncHandler(requireAuth), asyncHandler(handleLogout));
authRoutes.get('/auth/me', asyncHandler(requireAuth), handleCurrentUser);
authRoutes.get('/auth/admin-check', asyncHandler(requireAuth), requireRole(['admin']), handleCurrentUser);
authRoutes.post('/auth/test-login', asyncHandler(handleTestLogin));
