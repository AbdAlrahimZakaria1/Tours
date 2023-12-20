const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.SetTourUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
