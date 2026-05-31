import request from 'supertest';
import { app } from '../app';

describe('App basic routes', () => {
  it('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/v1/dashboard/me blocks guest', async () => {
    const res = await request(app).get('/api/v1/dashboard/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
