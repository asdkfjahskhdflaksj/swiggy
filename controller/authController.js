//node core module:
const { promisify } = require("util");

//third party module
const passport = require("passport");
const jwt = require("jsonwebtoken");

//doveloper module
const User = require("../model/user-model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

//createAndSendToken
const createAndSendToken = async (res, user, statusCode) => {
  promisify(jwt.sign)({ email: user.email }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  }).then((token) => {
    res.status(statusCode).json({
      status: "success",
      data: user,
      token,
    });
  });
};

//render login screen

exports.register = (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    if (err) return next(err);
    if (info) return next(new AppError(info.message, 401));
    await new Email(user).sendWelcome();
    createAndSendToken(res, user, 201).catch(next);
  })(req, res, next);
};

exports.login = (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) return next(err);
    if (info) return next(new AppError(info.message, 401));
    await new Email(user).sendWelcome();
    createAndSendToken(res, user, 200).catch(next);
  })(req, res, next);
};

exports.updateMe = async (req, res, next) => {
  console.log(req.file);
  const excludeFields = ["password", "name"];
  const filtereObject = { ...req.body };
  excludeFields.forEach((value) => delete filtereObject[value]);
  const user = await User.findByIdAndUpdate(req.user.id, filtereObject, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: user,
  });
};

exports.protect = (req, res, next) => {
  passport.authenticate("protect", (err, user, info) => {
    if (err) return next(err);
    if (info) return next(new AppError(info.message, 401));
    req.user = user;
    next();
  })(req, res, next);
};

//Seesion based login for authentication
exports.loginAndCreateSession = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};

exports.renderLoginPage = (req, res, next) => {
  res.render("login");
};
