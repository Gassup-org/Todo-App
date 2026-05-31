import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { createGoogleStrategy } from './config/auth.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';
import { requestId } from './middlewares/request-id.js';
import { adminRoutes } from './routes/admin-routes.js';
import { authRoutes } from './routes/auth-routes.js';
import { dashboardRoutes } from './routes/dashboard-routes.js';
import { healthRoutes } from './routes/health-routes.js';
import { todoRoutes } from './routes/todo-routes.js';
import { sendError } from './utils/api-response.js';

export function createApp() {
  passport.use(createGoogleStrategy());

  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(requestId);
  app.use(passport.initialize());

  app.use('/api/v1', healthRoutes);
  app.use('/api/v1', authRoutes);
  app.use('/api/v1', todoRoutes);
  app.use('/api/v1', dashboardRoutes);
  app.use('/api/v1', adminRoutes);

  app.use((_request, response) => {
    return sendError(response, 404, 'NOT_FOUND', 'Route not found');
  });

  app.use(errorHandler);

  return app;
}
