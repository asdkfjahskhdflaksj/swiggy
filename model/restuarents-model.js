const mongoose = require("mongoose");

const RestuarentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurent name is mandatory"],
    },
    address: {
      type: String,
      required: [true, "address is a mandatory field"],
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    numberOfRating: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RestuarentSchema.virtual("menu", {
  ref: "Menu",
  localField: "_id",
  foreignField: "restuarent",
  justOne: true,
});

RestuarentSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "restuarent",
});

module.exports = mongoose.model("Restaurant", RestuarentSchema);
