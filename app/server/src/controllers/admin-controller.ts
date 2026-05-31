import type { Request, Response } from 'express';
import {
  createUserAsAdmin,
  deactivateUserAsAdmin,
  deleteUserAsAdmin,
  listUsersForAdmin,
  reactivateUserAsAdmin,
  updateUserAsAdmin,
} from '../services/admin-service.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { sendData } from '../utils/api-response.js';
import {
  adminUserCreateSchema,
  adminUserListQuerySchema,
  adminUserReasonSchema,
  adminUserUpdateSchema,
} from '../validators/admin-validator.js';

function actorId(request: Request) {
  return (request as AuthenticatedRequest).authenticatedUser.id;
}

export async function handleListAdminUsers(request: Request, response: Response) {
  const query = adminUserListQuerySchema.parse(request.query);
  const users = await listUsersForAdmin(query.cursor, query.limit);

  return sendData(response, users);
}

export async function handleCreateAdminUser(request: Request, response: Response) {
  const input = adminUserCreateSchema.parse(request.body);
  const user = await createUserAsAdmin(actorId(request), input);

  return sendData(response, user, 201);
}

export async function handleUpdateAdminUser(request: Request, response: Response) {
  const input = adminUserUpdateSchema.parse(request.body);
  const user = await updateUserAsAdmin(actorId(request), String(request.params.id), input);

  return sendData(response, user);
}

export async function handleDeactivateAdminUser(request: Request, response: Response) {
  const input = adminUserReasonSchema.parse(request.body);
  const user = await deactivateUserAsAdmin(actorId(request), String(request.params.id), input.reason);

  return sendData(response, user);
}

export async function handleReactivateAdminUser(request: Request, response: Response) {
  const input = adminUserReasonSchema.parse(request.body);
  const user = await reactivateUserAsAdmin(actorId(request), String(request.params.id), input.reason);

  return sendData(response, user);
}

export async function handleDeleteAdminUser(request: Request, response: Response) {
  const input = adminUserReasonSchema.parse(request.body);
  const result = await deleteUserAsAdmin(actorId(request), String(request.params.id), input.reason);

  return sendData(response, result);
}
