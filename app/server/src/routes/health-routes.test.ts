import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../config/env.js', () => ({
  env: {
    CLIENT_ORIGIN: 'http://localhost:5173',
    PORT: 4000,
    GOOGLE_CLIENT_ID: 'test-google-client-id',
    GOOGLE_CLIENT_SECRET: 'test-google-client-secret',
    GOOGLE_CALLBACK_URL: 'http://localhost:4000/api/v1/auth/google/callback',
  },
}));

const { createApp } = await import('../app.js');

describe('health route', () => {
  it('returns service health', async () => {
    const response = await request(createApp()).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        status: 'ok',
        service: 'todo-app-server',
      },
      error: null,
    });
  });
});
