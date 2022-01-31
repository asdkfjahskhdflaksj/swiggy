const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIfeatures = require("../utils/apifeatures");

exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError("no document found for the given id", 404));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.getOne = (Model, ...popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions.length > 0) {
      popOptions.forEach((option) => {
        query = query.populate(option);
      });
    }
    //if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc)
      return next(new AppError("no document found for the given id", 404));
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const feature = new APIfeatures(Model.find(), req.query);
    feature.filter().sort().limitFields().page();
    const docs = await feature.query;
    res.status(200).json({
      status: "success",
      data: docs,
    });
  });
};
