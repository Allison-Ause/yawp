const { Router } = require('express');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const token = await UserService.signUp(req.body);
    console.log('TOKEN IS:', token);
    res
      .cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .json({ message: 'Successfully Logged In With New Account!' });
  } catch (e) {
    next(e);
  }
});
