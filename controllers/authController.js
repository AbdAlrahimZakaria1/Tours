const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = async (payload) =>
  jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = await signToken({ id: newUser._id });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check if both password and email is given
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(
        'Missing login info, please insert the email & password',
        401,
      ),
    );
  }
  const user = await User.findOne({ email }).select('+password');

  // 2) check if password is correct and user is present (by querying email)
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3) if all is good, send back the token
  const token = await signToken({ id: user._id });
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token and checking if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Invalid credentials - Please log in', 401));
  }

  // 2) token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists!', 401),
    );
  }
  // 4) check if user changed password after token was granted
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        'The password has been changed recently, please login again!',
        401,
      ),
    );
  }

  req.user = currentUser;
  // GRANT PERMISSION
  next();
});
