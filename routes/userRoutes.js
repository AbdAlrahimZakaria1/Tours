const express = require('express');
const userControllers = require('../controllers/userController');

const userRouter = express.Router();
userRouter
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
userRouter
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = userRouter;
