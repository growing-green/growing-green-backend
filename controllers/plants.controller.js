const Plant = require('../models/Plant');
const { BaseError, BadRequestError } = require('../lib/errors');
const mongoose = require('mongoose');

exports.getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find().lean();

    return res.status(201).json(plants);
  } catch {
    next(new BaseError());
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
