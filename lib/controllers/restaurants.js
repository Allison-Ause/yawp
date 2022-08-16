const Restaurant = require('../models/Restaurant');
const { Router } = require('express');

module.exports = Router().get('/', async (req, res, next) => {
  try {
    const data = await Restaurant.getAll();
    res.json(data);
  } catch (e) {
    next(e);
  }
});
