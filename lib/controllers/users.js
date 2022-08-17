const { Router } = require('express');
const UserService = require('../services/UserService');
const User = require('../models/User');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const token = await UserService.signUp(req.body);

      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Successfully Logged In With New Account!' });
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, authorize, async (req, res, next) => {
    try {
      const usersList = await User.getAllUsers();
      res.json(usersList);
    } catch (e) {
      next(e);
    }
  })
  .get('/profile', authenticate, async (req, res, next) => {
    try {
      const profile = await User.getById(req.user.id);
      profile.reviews = await profile.getUserReviews();
      res.json(profile);
    } catch (e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Welcome Back!' });
    } catch (e) {
      next(e);
    }
  });
