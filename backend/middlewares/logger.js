const winston = require('winston');

const requestFileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'request.log' })],
});

const errorFileLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'error.log' })],
});

const requestLogger = (req, res, next) => {
  requestFileLogger.info(`${req.method} ${req.url}`);
  next();
};

const errorLogger = (err, req, res, next) => {
  errorFileLogger.error(err.stack || err.message);
  next(err);
};

module.exports = { requestLogger, errorLogger };
