const controller = require("../controller/menuController");

const express = require("express");

const router = express.Router();

router.route("/").post(controller.addMenu).get(controller.getAllMenu);

router
  .route("/:id")
  .get(controller.getMenu)
  .patch(controller.updateMenu)
  .delete(controller.deleteMenu);

module.exports = router;
