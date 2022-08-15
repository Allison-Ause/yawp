const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async signUp({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
    });
    console.log('USER IS:', user);

    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 Day',
    });

    return token;
  }
};
