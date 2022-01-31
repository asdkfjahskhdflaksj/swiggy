module.exports = (err, req, res, next) => {
  const status = err.status || "error";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};
