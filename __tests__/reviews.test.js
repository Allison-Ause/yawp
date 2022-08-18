const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'allison@works.com',
  password: 'fakePasswordHash',
};

const adminUser = {
  email: 'admin',
  password: '1234password',
};

describe('reviews routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it.skip('#DELETE /reviews/:id deletes review for admin', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(adminUser);

    const res = await agent.delete('/api/v1/reviews/1');
    expect(res.status).toBe(200);

    const confirmRes = await agent.get('/api/v1/reviews/1');
    expect(confirmRes.status).toBe(404);
  });
  it.skip('#DELETE /reviews/:id deletes review for review-owner', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(testUser);

    const res = await agent.delete('/api/v1/reviews/5');
    expect(res.status).toBe(200);

    const confirmRes = await agent.get('/api/v1/reviews/5');
    expect(confirmRes.status).toBe(404);
  });
  it.skip('#DELETE /reviews/:id will not delete & gives 401 if not authenticated', async () => {
    const res = await request(app).delete('/api/v1/reviews/2');
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual('Sign in to view');
  });
  afterAll(async () => {
    await setup(pool);
    pool.end();
  });
});
