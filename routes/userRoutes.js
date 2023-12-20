const express = require('express');
const userControllers = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userControllers.updateMe);
router.delete('/deleteMe', authController.protect, userControllers.deleteMe);

router.patch('/resetPassword/:token', authController.resetPassword);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
