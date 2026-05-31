import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';

const googleCallbackSchema = z.object({
  code: z.string().min(1)
});

const router = Router();

router.get('/google', authController.googleRedirect);
router.get('/google/callback', authController.googleCallbackRedirect);
router.get('/google/url', authController.googleUrl);
router.post('/google/callback', validateBody(googleCallbackSchema), authController.googleCallback);
router.get('/me', requireAuth, authController.me);
router.post('/logout', requireAuth, authController.logout);

export default router;
