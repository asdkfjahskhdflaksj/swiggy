const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: {
    ref: "Menu",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "a food is required"],
  },
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "product is added to the cart by only user"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "a price is must always be required"],
  },
});

const cartSchema = new mongoose.Schema({
  items: [itemSchema],
  subTotal: Number,
});

module.exports = mongoose.model("Cart", cartSchema);
