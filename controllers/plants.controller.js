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
  const token = req.headers.authorization.split(' ')[1];
  const { _id } = await jwt.verify(token, tokenSecretKey);

  if (!newPlant) {
    return next(new BadRequestError('식물 데이터가 유효하지 않습니다.'));
  }

  try {
    const plant = await Plant.create({
      userId: _id,
      newPlant,
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

exports.updatePlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { state, isIncrease } = req.body;
    console.log(state, isIncrease);
    const targetPlant = await Plant.findOne({ _id: plantId });

    if (!targetPlant) {
      return next(new BaseError());
    }

    switch (state) {
      case 'water': {
        if (isIncrease === true) {
          targetPlant.water_guage.current_guage =
            targetPlant.water_guage.current_guage + 1;
        } else {
          targetPlant.water_guage.current_guage =
            targetPlant.water_guage.current_guage - 1;
        }

        break;
      }

      case 'sun': {
        if (isIncrease === true) {
          targetPlant.sun_guage.current_guage =
            targetPlant.sun_guage.current_guage + 1;
        } else {
          targetPlant.sun_guage.current_guage =
            targetPlant.sun_guage.current_guage - 1;
        }

        break;
      }

      case 'blind': {
        targetPlant.is_blind_up = !targetPlant.is_blind_up;

        break;
      }

      case 'penalty': {
        if (isIncrease === true) {
          targetPlant.penalty_points = targetPlant.penalty_points + 1;
        } else {
          targetPlant.penalty_points = targetPlant.penalty_points - 1;
        }

        break;
      }
    }

    await targetPlant.save();

    return res.status(201).json({ plant: targetPlant });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('유효하지 않은 데이터입니다.'));
    }

    next(new BaseError());
  }
};
