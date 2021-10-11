const Plant = require('../models/Plant');
const {
  BaseError,
  BadRequestError,
  InvalidTokenError,
  TokenExpiredError,
} = require('../lib/errors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { tokenSecretKey } = require('../configs');

exports.getAllPlantsById = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { _id } = await jwt.verify(token, tokenSecretKey);
    const plants = await Plant.find({ userId: _id }).lean();

    return res.status(201).json(plants);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new TokenExpiredError());
    }

    next(new InvalidTokenError());
  }
};

exports.createNewPlant = async (req, res, next) => {
  const newPlant = req.body;

  if (!newPlant) {
    return next(new BadRequestError('식물 데이터가 유효하지 않습니다.'));
  }

  const {
    name,
    plantSpecies,
    lightingEnvironment,
    growthStage,
    lastWindowOpen,
    defaultSunGuage,
    defaultWreringGuage,
  } = newPlant;

  try {
    const plant = await Plant.create({
      name,
      plant_species: plantSpecies,
      lighting_environment: lightingEnvironment,
      growth_stage: growthStage,
      last_window_open: lastWindowOpen,
      sun_guage: {
        default_guage: defaultSunGuage,
      },
      watering_guage: {
        default_guage: defaultWreringGuage,
      },
    });

    res.json({
      plant,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(err.message));
    }

    next(BaseError(err.message));
  }
};
