const Review = require("../model/reviewModel");
const factory = require("../factory/handlerFactory");

exports.setResUserFields = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.restuarent) req.body.restuarent = req.params.restuarent;
  next();
};

exports.createReview = factory.createOne(Review);

exports.getAllReview = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deletReview = factory.deleteOne(Review);
