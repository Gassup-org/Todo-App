import { TodoPriority, TodoStatus } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { todoController } from '../controllers/todo.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';

const prioritySchema = z.enum(['low', 'medium', 'high']).transform((value) => value.toUpperCase() as TodoPriority);
const statusSchema = z
  .enum(['pending', 'completed', 'archived'])
  .transform((value) => value.toUpperCase() as TodoStatus);

const createTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  priority: prioritySchema.optional(),
  reminderEmailEnabled: z.boolean().optional(),
  reminderAt: z.string().min(1).optional()
});

const updateTodoSchema = createTodoSchema.partial().extend({
  status: statusSchema.optional(),
  reminderAt: z.string().min(1).nullable().optional()
});

const router = Router();

router.use(requireAuth);
router.post('/', validateBody(createTodoSchema), todoController.create);
router.get('/', todoController.listByDate);
router.put('/:id', validateBody(updateTodoSchema), todoController.update);
router.patch('/:id', validateBody(updateTodoSchema), todoController.update);
router.patch('/:id/toggle', todoController.toggleCompleted);
router.patch('/:id/toggle-completed', todoController.toggleCompleted);
router.delete('/:id', todoController.remove);

export default router;
