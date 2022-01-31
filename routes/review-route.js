//third party models
const express = require("express");
const passport = require("passport");

//doveloper models:
const conntroller = require("../controller/reviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    passport.authenticate("protect"),
    conntroller.setResUserFields,
    conntroller.createReview
  )
  .get(conntroller.getAllReview);

router
  .route(":/")
  .get(conntroller.getReview)
  .patch(conntroller.updateReview)
  .delete(conntroller.deletReview);

module.exports = router;
