const express = require('express');
const tourControllers = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log({ id: val });
  next();
});

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/get-stats').get(tourControllers.getStats);

router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

module.exports = router;
