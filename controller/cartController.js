const Cart = require("../model/cart-model");
const Menu = require("../model/menu-model");

exports.addToCart = async (req, res, next) => {
  const { quantity, itemId } = req.body;
  const userId = req.user.id;
  const menu = await Menu.findById(itemId);
  let cart = await Cart.find();
  const cartIndex = cart
    .map((doc, i) => doc.items[i])
    .findIndex((doc) => doc.userId == userId);
  if (cart && cart.length !== 0 && cartIndex !== -1) {
    cart = cart[cartIndex];
    const foundIndex = cart.items.findIndex((doc) => doc.itemId == itemId);
    //if items present and quantity is zero
    if (foundIndex !== -1 && quantity <= 0) {
      cart.items.splice(foundIndex, 1);
      cart.subTotal = cart.items
        .map((doc) => doc.quantity * doc.price)
        .reduce((acc, next) => acc + next);
      const cartItem = await cart.save();
      res.status(200).json({
        status: "success",
        data: cartItem,
      });
    }

    //if the item present in the cart
    else if (foundIndex !== -1) {
      const item = cart.items[foundIndex];
      item.quantity = item.quantity + quantity;
      cart.items[foundIndex] = item;
      cart.subTotal = cart.items
        .map((doc) => doc.quantity * doc.price)
        .reduce((acc, next) => acc + next);
      const cartItem = await cart.save();
      res.status(200).json({
        status: "success",
        data: cartItem,
      }); //if the item is not there in the item array
    } else if (foundIndex === -1) {
      cart.items.push({
        itemId,
        userId,
        quantity,
        price: menu.price,
      });
      cart.subTotal = cart.items
        .map((doc) => doc.quantity * doc.price)
        .reduce((acc, next) => acc + next);
      const cartItem = await cart.save();
      res.status(200).json({
        status: "success",
        data: cartItem,
      });
    }
  } else {
    const cartItem = await Cart.create({
      items: [
        {
          itemId,
          userId,
          quantity,
          price: menu.price,
        },
      ],
      subTotal: quantity * menu.price,
    });
    res.status(201).json({
      status: "success",
      data: cartItem,
    });
  }
};
