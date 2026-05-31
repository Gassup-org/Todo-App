import { Router } from 'express';
import { sendData } from '../utils/api-response.js';

export const healthRoutes = Router();

healthRoutes.get('/health', (_request, response) => {
  return sendData(response, {
    status: 'ok',
    service: 'todo-app-server',
  });
});
