const { Router } = require('express');
const Review = require('../models/Review');
const authenticate = require('../middleware/authenticate');
const clearance = require('../middleware/clearance');

module.exports = Router().delete(
  '/:id',
  authenticate,
  clearance,
  async (req, res, next) => {
    try {
      const data = await Review.delete(req.params.id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);
