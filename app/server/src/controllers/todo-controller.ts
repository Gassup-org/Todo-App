import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { createUserTodo, deleteUserTodo, getTodosForDate, updateUserTodo } from '../services/todo-service.js';
import { sendData } from '../utils/api-response.js';
import { todoCreateSchema, todoDateQuerySchema, todoUpdateSchema } from '../validators/todo-validator.js';

function getAuth(request: Request) {
  return (request as AuthenticatedRequest).authenticatedUser;
}

export async function handleListTodos(request: Request, response: Response) {
  const { date } = todoDateQuerySchema.parse(request.query);
  const user = getAuth(request);
  const todos = await getTodosForDate(user.id, user.timezone, date);

  return sendData(response, todos);
}

export async function handleCreateTodo(request: Request, response: Response) {
  const input = todoCreateSchema.parse(request.body);
  const todo = await createUserTodo(getAuth(request).id, input);

  return sendData(response, todo, 201);
}

export async function handleUpdateTodo(request: Request, response: Response) {
  const input = todoUpdateSchema.parse(request.body);
  const todo = await updateUserTodo(getAuth(request).id, String(request.params.id), input);

  return sendData(response, todo);
}

export async function handleDeleteTodo(request: Request, response: Response) {
  const result = await deleteUserTodo(getAuth(request).id, String(request.params.id));

  return sendData(response, result);
}
