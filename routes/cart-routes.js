//third party module
const express = require("express");
const passport = require("passport");

//doveloper module:
const controller = require("../controller/cartController");

const router = express.Router();

router.route("/").post(passport.authenticate("protect"), controller.addToCart);

module.exports = router;
