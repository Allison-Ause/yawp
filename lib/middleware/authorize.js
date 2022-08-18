module.exports = async (req, res, next) => {
  try {
    if (!req.user || req.user.email !== 'admin')
      throw new Error('You do not have sufficient clearance.');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
