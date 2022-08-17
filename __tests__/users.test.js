const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'test@test.com',
  password: '1234password',
};

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('#POST /users should create a new user if none exists', async () => {
    const res = await request(app).post('/api/v1/users').send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      'Successfully Logged In With New Account!'
    );
  });
  it('#POST /users/sessions should login user if pre-existing', async () => {
    const res = await request(app).post('/api/v1/users/sessions').send({
      email: 'allison@works.com',
      password: 'fakePasswordHash',
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Welcome Back!');
  });
  it('#GET /users displays list of users if admin', async () => {
    const adminUser = {
      email: 'admin',
      password: '1234password',
    };

    const agent = request.agent(app);

    await agent.post('/api/v1/users').send(adminUser);
    const res = await agent.get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    expect(res.body[2].email).toEqual('kylo@ren.com');
  });
  it('#GET /users displays 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(401);
  });
  it('#GET /users displays 403 if not authorized admin', async () => {
    const lowLevelUser = {
      email: 'Tommy@Loser.com',
      password: '1234password',
    };

    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(lowLevelUser);
    const res = await agent.get('/api/v1/users');
    expect(res.status).toBe(403);
  });
  it('#GET /users/profile displays all users information and reviews', async () => {
    const res = await request(app).get('/api/v1/users/profile');
    console.log('RES.BODY', res.body);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    expect(res.body[2].email).toEqual('kylo@ren.com');
  });
  afterAll(async () => {
    await setup(pool);
    pool.end();
  });
});
