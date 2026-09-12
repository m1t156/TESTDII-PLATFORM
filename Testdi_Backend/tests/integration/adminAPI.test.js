const request = require('supertest');
const app = require('../../server');

describe('API Route Integration Tests', () => {
  describe('Health Check Endpoint', () => {
    it('GET /api/health should return status OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('Unauthenticated Route Guarding', () => {
    it('GET /api/admin/dashboard without token should return 401', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.statusCode).toBe(401);
    });

    it('GET /api/admin/questions without token should return 401', async () => {
      const res = await request(app).get('/api/admin/questions');
      expect(res.statusCode).toBe(401);
    });
  });
});
