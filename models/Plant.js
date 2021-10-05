const mongoose = require('mongoose');

const schemaOption = {
  timestamps: true,
};

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, 'Plant name should be unique'],
    },
    growth_stage: {
      type: Number,
      enum: [1, 2, 3],
      required: [true, 'Grwoth stage is required'],
    },
    penalty_points: {
      type: Number,
      default: 0,
      min: [0, 'Penalty points should be more than 1'],
      max: [10, 'Penalty points should be less than 10'],
    },
    lighting_environment: {
      type: String,
      enum: ['sunny', 'shade'],
      required: [true, 'Lighting environment is required'],
    },
    last_window_open: {
      type: Date,
    },
    sunGuage: {
      type: sunGuageSchema,
    },
    wateringGuage: {
      type: wateringGuageSchema,
    },
  },
  schemaOption,
);

const sunGuageSchema = new mongoose.Schema({
  default_score: {
    type: Number,
  },
  current_score: {
    type: Number,
  },
  full_date: {
    type: Date,
  },
  empty_date: {
    type: Date,
  },
});

const wateringGuageSchema = new mongoose.Schema({
  default_score: {
    type: Number,
  },
  current_score: {
    type: Number,
  },
  empty_date: {
    type: Date,
  },
});

module.exports = mongoose.model('Plant', plantSchema);
