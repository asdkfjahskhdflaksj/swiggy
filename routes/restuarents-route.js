//third party model
const express = require("express");

//doveloper model
const controller = require("../controller/restuarentsController");
const ReviewRouter = require("../routes/review-route");

const router = express.Router();

router.use("/:restuarent/reviews", ReviewRouter);

router
  .route("/")
  .post(controller.createRestaurant)
  .get(controller.getAllRestaurant);
router
  .route("/:id")
  .get(controller.getRestaurant)
  .patch()
  .delete(controller.deleteRestaurent);

module.exports = router;
