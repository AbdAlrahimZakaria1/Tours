const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priceDiscount: {
    type: Number,
    default: 0,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have an image cover'],
  },
  images: [String],
  startDates: [String],
  rating: {
    type: Number,
    required: false,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

/**
 *   {
    "id": 0,
    "name": "The Forest Hiker",
    "duration": 5,
    "maxGroupSize": 25,
    "difficulty": "easy",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 37,
    "price": 397,
    "summary": "Breathtaking hike through the Canadian Banff National Park",
    "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "imageCover": "tour-1-cover.jpg",
    "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
    "startDates": ["2021-04-25,10:00", "2021-07-20,10:00", "2021-10-05,10:00"]
  },

 */
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
