const Restaurant = require('../models/Restaurant');
const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/:restId', authenticate, async (req, res, next) => {
    console.log('REQ.PARAMS.restID', req.params.restId);
    try {
      const data = await Restaurant.getById(req.params.restId); //why is params 1 but .id is undefined
      if (!data) {
        next();
      }
      res.json(data);
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
