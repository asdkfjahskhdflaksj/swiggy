//third party module import
const express = require("express");
const passport = require("passport");

//dovelpoer module import

const authController = require("../controller/authController");
const userController = require("../controller/userController");

const router = express.Router();

//Real time authentication system using the passport local
router.route("/register").post(authController.register);

//login authentication using jwt
router.route("/login").post(authController.login);

router
  .route("/updateMe")
  .patch(
    authController.protect,
    userController.uploadSingleFile,
    authController.updateMe
  );

//login authentication using session
router
  .route("/loginsession")
  .post(
    passport.authenticate("loginsession"),
    authController.loginAndCreateSession
  );

router.route("/checksession").get((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  res.status(200).json({
    status: "success",
    data: req.session,
    data1: req.user,
  });
});

router.route("/loginview").get(authController.renderLoginPage);

//router.route("/signup").post(authController.signUp);

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  }),
  (req, res, next) => {
    res.status(200).json({
      status: "success",
      data: req.body,
    });
  }
);

router
  .route("/google/redirect")
  .get(passport.authenticate("google"), (req, res, next) => {
    res.send("good i did it");
  });

module.exports = router;
