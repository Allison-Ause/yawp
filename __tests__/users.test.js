const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;
  const agent = request.apply.agent(app);
  const user = await UserService.create({ ...testUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({
    email,
    password,
  });
  return [agent, user];
};

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
  afterAll(async () => {
    await setup(pool);
    pool.end();
  });
});
