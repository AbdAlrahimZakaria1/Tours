const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! please use /signup instead.',
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

exports.deleteUser = factory.deleteOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// THIS ONE DOESN'T RUN PASSOWRD VADLIDATORS!!!
exports.updateUser = factory.updateOne(User);
