import { Router } from 'express';
import { handleCreateTodo, handleDeleteTodo, handleListTodos, handleUpdateTodo } from '../controllers/todo-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { asyncHandler } from '../utils/async-handler.js';

export const todoRoutes = Router();

todoRoutes.use(asyncHandler(requireAuth));
todoRoutes.get('/todos', asyncHandler(handleListTodos));
todoRoutes.post('/todos', asyncHandler(handleCreateTodo));
todoRoutes.patch('/todos/:id', asyncHandler(handleUpdateTodo));
todoRoutes.delete('/todos/:id', asyncHandler(handleDeleteTodo));
