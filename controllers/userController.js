const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    users,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1- if password or password confirm is given, throw an error
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for changing passwords, Please use /updateMyPassword',
      ),
      401,
    );
  }

  // 2- filter body object
  const filteredObj = filterObj(req.body, 'name', 'email');
  // 3- find user by id and update
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });
  // 4- return response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1- get the user by req.user & inactivate
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // 2- send res
  res.status(204).json({
    status: 'success',
  });
});
