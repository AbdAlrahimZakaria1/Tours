const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please insert another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid data input. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleInvalidJWTError = () =>
  new AppError('Invalid token, please log in again!', 401);

const handleJWTExpiredTokenError = () =>
  new AppError('Token has expired, please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED ERROR
  return res
    .status(err.statusCode)
    .render('error', { title: 'Something went wrong', msg: err.message });
};

const sendErrorProd = (err, req, res) => {
  // A) API error handling
  if (req.originalUrl.startsWith('/api')) {
    // Operational, Trusted error: send message to client.
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or unknown error: don't send details to client
    // 2) send generic response
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED ERROR error handling
  if (err.isOperational) {
    return res.status(500).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or unknown error: don't send details to client
  // 2) send generic response
  console.error('ERROR', err);
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.statusCode || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateErrorDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleInvalidJWTError();
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredTokenError();

    sendErrorProd(error, req, res);
  }
};
