const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/search', async (req, res, next) => {
    //?name=:name user insert
    try {
      console.log('REQ.PARAMS', req.query);
      const restaurant = await Restaurant.searchByName(req.query.name);
      if (!restaurant) {
        next();
      }
      restaurant.reviews = await restaurant.getReviews();
      console.log('DATA IN CONTROLLER', restaurant);
      res.json(restaurant);
    } catch (e) {
      next(e);
    }
  })
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
  .post('/:restId/reviews', authenticate, async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        user_id: req.user.id,
        restaurant_id: req.params.restId,
      };
      const newReview = await Review.insert(data);

      return res.json(newReview);
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
