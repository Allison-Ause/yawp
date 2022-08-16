const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies && req.cookies[process.env.COOKIE_NAME];
    console.log('COOKIE FROM AUTH', cookie);
    if (!cookie) throw new Error('Sign in to view');

    const user = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = user;
    console.log('user from auth', req.user);

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
