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
  it('#GET /restaurants display open access list of all restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(3);
  });
  it('#GET /restaurants/:restId display open access detail & reviews for one restaurant', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      name: 'Tropicale',
      cuisine: 'Colombian',
      reviews: expect.any(Array),
    });
  });
  it('#POST /restaurants/:restId/reviews creates new review for authenticated users', async () => {
    const testReview = {
      stars: 4,
      detail: 'I love this place!',
    };

    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(testUser);

    const res = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send(testReview);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '7',
      ...testReview,
      user_id: expect.any(String),
      restaurant_id: '1',
    });
  });
  it('#GET /restaurants/search?name= gives restaurants by name', async () => {
    const res = await request(app).get(
      '/api/v1/restaurants/search?name=Tropicale'
    );
    console.log('RES.BODY in TEST', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      name: 'Tropicale',
      cuisine: 'Colombian',
      reviews: expect.any(Array),
    });
  });
  afterAll(async () => {
    await setup(pool);
    pool.end();
  });
});
