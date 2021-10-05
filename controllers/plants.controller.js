const Plant = require('../models/Plant');
const { BaseError } = require('../lib/errors');

exports.getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find().lean();

    return res.status(201).json(plants);
  } catch (err) {
    next(new BaseError());
  }
};
