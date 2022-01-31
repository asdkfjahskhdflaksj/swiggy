const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: [true, "foodName is required"],
    },
    description: String,
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    restuarent: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "restuarent is required"],
      ref: "Restaurant",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Menu", menuSchema);
