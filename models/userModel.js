const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email.'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minlength: [7, 'Password must be longer than 7 characters.'],
    maxlength: [50, 'Password must not be longer than 50 characters.'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    // This only runs on SAVE and CREATE so we have to be careful of updating.
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if the password has actually been modified
  if (!this.isModified('password')) return next();

  // Encrypt the password and add salt (12) value
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field as it's not longer needed (this part works after validation is done)
  this.passwordConfirm = undefined;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
