const mongoose = require('mongoose');
const { BadRequestError } = require('../lib/errors');

const schemaOption = {
  timestamps: true,
};

const sunGuageSchema = new mongoose.Schema({
  default_guage: {
    type: Number,
    required: [true, 'Default score is required'],
  },
  current_guage: {
    type: Number,
    required: [true, 'Current score is required'],
    default: 0,
    max: () => {
      return this.default_guage;
    },
  },
  full_date: {
    type: Date,
    default: null,
  },
  empty_date: {
    type: Date,
    default: null,
  },
});

const wateringGuageSchema = new mongoose.Schema({
  default_guage: {
    type: Number,
    required: [true, 'Default score is required'],
  },
  current_guage: {
    type: Number,
    required: [true, 'Current score is required'],
  },
  empty_date: {
    type: Date,
    default: null,
  },
});

const plantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User id is required'],
    },
    name: {
      type: String,
      required: [true, 'Plant name is required'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
    },
    type: {
      type: String,
      required: [true, 'plant Type is required'],
    },
    is_blind_up: {
      type: Boolean,
      default: true,
    },
    growth_stage: {
      type: Number,
      enum: [1, 2, 3],
      required: [true, 'Growth stage is required'],
    },
    penalty_points: {
      type: Number,
      default: 0,
      min: [0, 'Penalty points should be more than 1'],
      max: [10, 'Penalty points should be less than 10'],
    },
    is_sun_plant: {
      type: Boolean,
      default: true,
      required: [true, 'Lighting environment is required'],
    },
    last_window_open: {
      type: Date,
      default: null,
    },
    sun_guage: {
      type: sunGuageSchema,
    },
    water_guage: {
      type: wateringGuageSchema,
    },
  },
  schemaOption,
);

plantSchema.index({ name: 1 }, { unique: true });

plantSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new BadRequestError('Plant name is already exist.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('Plant', plantSchema);
