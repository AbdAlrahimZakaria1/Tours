const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review must not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be higher or equal than 1'],
      max: [5, 'Rating must be lower or equal than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ user: 1, tour: 1 }, { unique: 1 });

reviewSchema.pre(/^find/, function (next) {
  // this.populate([
  //   { path: 'tour', select: 'name' },
  //   { path: 'user', select: 'name photo' },
  // ]);
  this.populate([{ path: 'user', select: 'name photo' }]);

  next();
});

// Update the ratings of the tours after CREATING a new review
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
// To run the method above after Review is created
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// METHOD 1
// To run the method above after either UPDATING or DELETING a review
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.review = await this.findOne();
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   // this.findOne(); does NOT work here, query would be done executing here.
//   await this.review.constructor.calcAverageRatings(this.review.tour);
// });

// METHOD 2
// To run the method above after either UPDATING or DELETING a review
reviewSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) await doc.constructor.calcAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
