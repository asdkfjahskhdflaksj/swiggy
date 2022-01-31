const Restaurant = require("../model/restuarents-model");
const factory = require("../factory/handlerFactory");

exports.createRestaurant = factory.createOne(Restaurant);

exports.getAllRestaurant = factory.getAll(Restaurant);
exports.getRestaurant = factory.getOne(
  Restaurant,
  { path: "menu", select: "foodName description -_id -restuarent" },
  { path: "reviews", select: "review rating -_id -restuarent" }
);
exports.updateRestaurent = factory.updateOne(Restaurant);

exports.deleteRestaurent = factory.deleteOne(Restaurant);
