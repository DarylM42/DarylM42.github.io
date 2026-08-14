const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Trip = mongoose.model('Trip');

const buildError = (status, message, errors) => {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  return error;
};

/**
 * Return the full list of trip documents.
 */
const tripsList = async (req, res, next) => {
  try {
    const trips = await Trip.find().lean().exec();
    return res.status(200).json(trips);
  } catch (err) {
    return next(buildError(500, 'Unable to load trips'));
  }
};

/**
 * Return a single trip document by its trip code.
 */
const tripsFindByCode = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode }).lean().exec();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (err) {
    return next(buildError(500, 'Unable to load trip'));
  }
};

/**
 * Create a new trip after route-level validation succeeds.
 */
const tripsCreate = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(buildError(400, 'Trip validation failed', errors.array()));
  }

  try {
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      start: req.body.start,
      description: req.body.description,
      length: req.body.length,
      price: req.body.price
    });

    return res.status(201).json(trip);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(buildError(400, 'Trip validation failed', Object.values(err.errors).map(({ message, path }) => ({ message, path }))));
    }

    return next(buildError(400, 'Unable to create trip'));
  }
};

/**
 * Update an existing trip by trip code after validation succeeds.
 */
const tripsUpdateOne = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(buildError(400, 'Trip validation failed', errors.array()));
  }

  try {
    const currentTrip = await Trip.findOne({ code: req.params.tripCode }).exec();

    if (!currentTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const updatePayload = {
      code: req.body.code,
      name: req.body.name,
      start: req.body.start,
      description: req.body.description,
      length: req.body.length,
      price: req.body.price
    };

    if (!updatePayload.code || !updatePayload.name || !updatePayload.start || !updatePayload.description) {
      return res.status(400).json({ message: 'code, name, start, and description are required' });
    }

    const duplicateCode = await Trip.findOne({
      code: updatePayload.code,
      _id: { $ne: currentTrip._id }
    })
      .lean()
      .exec();

    if (duplicateCode) {
      return res.status(409).json({ message: 'Trip code already exists' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(currentTrip._id, updatePayload, {
      returnDocument: 'after',
      runValidators: true
    })
      .lean()
      .exec();

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(updatedTrip);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(buildError(400, 'Trip validation failed', Object.values(err.errors).map(({ message, path }) => ({ message, path }))));
    }

    return next(buildError(400, 'Unable to update trip'));
  }
};

/**
 * Delete a trip by trip code.
 */
const tripsDeleteOne = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(buildError(400, 'Trip validation failed', errors.array()));
  }

  try {
    const deletedTrip = await Trip.findOneAndDelete({ code: req.params.tripCode });

    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(204).json(null);
  } catch (err) {
    return next(buildError(400, 'Unable to delete trip'));
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsCreate,
  tripsUpdateOne,
  tripsDeleteOne
};
