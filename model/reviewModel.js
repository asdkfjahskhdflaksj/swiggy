const mongoose = require("mongoose");
const Restaurant = require("../model/restuarents-model");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "a review is definetely required"],
  },
  rating: Number,
  restuarent: {
    ref: "Restaurant",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "a review must always required"],
  },
  user: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "a review must always by a user"],
  },
});

reviewSchema.statics.calcAvgRating = async function (restuarent) {
  const result = await this.aggregate([
    {
      $match: { restuarent },
    },
    {
      $group: {
        _id: "$restuarent",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Restaurant.findByIdAndUpdate(restuarent, {
    numberOfRating: result[0].nRating,
    ratingAverage: result[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.restuarent);
});

reviewSchema.pre(/^findOne/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOne/, function () {
  this.r.constructor.calcAvgRating(this.r.restuarent);
});

reviewSchema.index({ user: 1, restuarent: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
