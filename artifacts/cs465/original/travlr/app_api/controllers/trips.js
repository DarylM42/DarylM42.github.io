const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

// GET /api/trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find().lean().exec();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET /api/trips/:tripCode
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode }).lean().exec();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST /api/trips
const tripsCreate = async (req, res) => {
  console.log("POST /api/trips received:", req.body);

  try {
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      start: req.body.start,
      description: req.body.description,
      length: req.body.length,
      price: req.body.price
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json(err);
  }
};

// PUT /api/trips/:tripCode
const tripsUpdateOne = async (req, res) => {
  console.log("PUT /api/trips received:", req.params.tripCode, req.body);

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
      new: true,
      runValidators: true
    })
      .lean()
      .exec();

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(updatedTrip);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// DELETE /api/trips/:tripCode
const tripsDeleteOne = async (req, res) => {
  console.log("DELETE /api/trips received:", req.params.tripCode);

  try {
    const deletedTrip = await Trip.findOneAndDelete({ code: req.params.tripCode });

    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(204).json(null);
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsCreate,
  tripsUpdateOne,
  tripsDeleteOne
};
