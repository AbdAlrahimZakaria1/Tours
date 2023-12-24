const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// *** GLOBAL middlewares ***

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// body parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// development logging info
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// sets limit to request number for an IP
const rateLimit = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', rateLimit);

// Test middleware
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find route ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
