const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    id: {
      // Hide the id field (while keeping _id)
      type: String,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'Tour name must be longer or equal than 10 letters'],
      maxlength: [50, 'Tour name must be shorter or equal than 50 letters'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either on of [easy, medium, difficutl]',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'AvgRating must be higher or equal than 1'],
      max: [5, 'AvgRating must be lower or equal than 5'],
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
      min: [1, 'Rating must be higher or equal than 1'],
      max: [5, 'Rating must be lower or equal than 5'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        // "this" Only works on current document creation (doesn't work on updating)
        validator: function (value) {
          return this.price > value;
        },
        message: 'Price discount ({VALUE}) must be lower than the normal price',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      Description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        Description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE
// Only works for .save() & .create(), used to modify the document before saving it
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
// Embedding users ("guides") to the tour documents
// tourSchema.pre('save', async function (next) {
//   const guidesPormises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPormises);
//   next();
// });

// tourSchema.pre('save', (next) => {
//   console.log('Saving document...');
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.queryTime = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(docs);
//   console.log(`Query time is ${Date.now() - this.queryTime}`);
//   next();
// });

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
