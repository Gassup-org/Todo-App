import type { Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { requireRole } from './require-role.js';

describe('requireRole', () => {
  it('allows matching roles', () => {
    const next = vi.fn();
    const middleware = requireRole(['admin']);
    const request = { authenticatedUser: { role: 'admin' } };
    const response = { locals: { requestId: 'req_1' } } as unknown as Response;

    middleware(request as never, response, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('blocks non-matching roles', () => {
    const next = vi.fn();
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const middleware = requireRole(['admin']);
    const request = { authenticatedUser: { role: 'user' } };
    const response = { locals: { requestId: 'req_1' }, status } as unknown as Response;

    middleware(request as never, response, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      data: null,
      error: {
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
        details: undefined,
        requestId: 'req_1',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
