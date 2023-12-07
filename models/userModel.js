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
    select: false,
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
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if the password has actually been modified
  if (!this.isModified('password')) return next();

  // Encrypt the password and add salt (12) value
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field as it's not longer needed (this part works after validation is done)
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const ChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    console.log(JWTTimeStamp);
    console.log(ChangedTimestamp);
    return JWTTimeStamp < ChangedTimestamp;
  }
  console.log(JWTTimeStamp);
  console.log(this.passwordChangedAt);

  // Password was not CHANGED
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
