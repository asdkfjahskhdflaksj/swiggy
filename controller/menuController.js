const Menu = require("../model/menu-model");
const factory = require("../factory/handlerFactory");

exports.addMenu = factory.createOne(Menu);
exports.getMenu = factory.getOne(Menu);
exports.getAllMenu = factory.getAll(Menu);
exports.updateMenu = factory.updateOne(Menu);
exports.deleteMenu = factory.deleteOne(Menu);
