const Restaurant = require('../models/Restaurant');
const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/:restId', authenticate, async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getById(req.params.restId);
      if (!restaurant) {
        next();
      }
      restaurant.reviews = await restaurant.getReviews();
      res.json(restaurant);
    } catch (e) {
      next(e);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const data = await Restaurant.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
