const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'test@test.com',
  password: '1234password',
};

describe('restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('/restaurants display open access list of all restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(3);
  });
  afterAll(async () => {
    await setup(pool);
    pool.end();
  });
  it('/restaurants/:restId display rest.detail for authenticated users', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(testUser);

    const res = await agent.get('/api/v1/restaurants/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      name: 'Tropicale',
      cuisine: 'Colombian',
      reviews: expect.any(Array),
    });
  });
  it('/restaurants/:id gives 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual('Sign in to view');
  });
  it('#POST /restaurants/:restId/reviews creates new review for authenticated users', async () => {
    const testReview = {
      rating: 4,
      content: 'I love this place!',
    };

    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(testUser);
    console.log('AGENT', agent);

    const res = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send(testReview);
    console.log('RES', res.body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '7',
      ...testReview,
      user_id: expect.any(String),
      restaurant_id: '1',
    });
  });
});
