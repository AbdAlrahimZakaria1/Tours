const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tours
  const tours = await Tour.find();
  // 2) build template
  // 3) send tours to build the template
  res.status(200).render('overview', { title: 'All tours', tours });
});

exports.getTour = (req, res) => {
  res.status(200).render('tour', { title: 'The forest hiker' });
};
