const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Se ha producido un error en el servidor'
    : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
