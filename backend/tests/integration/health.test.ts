import request from 'supertest';
import app from '../../src/server';

describe('GET /api/v1/health', () => {
  it('deve retornar status 200', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
  });

  it('deve retornar status "ok"', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.body.status).toBe('ok');
  });

  it('deve retornar timestamp no formato ISO', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp).toISOString()).toBe(
      response.body.timestamp,
    );
  });
});
