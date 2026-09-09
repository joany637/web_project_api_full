/*const { isCelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => { // ← NO borres el 'next'
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Ha ocurrido un error en el servidor';

  // Errores de validación Celebrate → código 400
  if (isCelebrateError(err)) {
    statusCode = 400;
    const errorBody = err.details.get('body') || err.details.get('params') || err.details.get('query');
    message = errorBody ? errorBody.details[0].message : 'Datos inválidos';
  }

  // Error de clave duplicada en MongoDB → código 409
  if (err.code === 11000) {
    statusCode = 409;
    message = 'El correo ya está registrado';
  }

  // Errores de validación de Mongoose → código 400
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // En producción, ocultar detalles del error 500
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Ha ocurrido un error en el servidor';
  }

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;*/
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Se ha producido un error en el servidor'
    : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;