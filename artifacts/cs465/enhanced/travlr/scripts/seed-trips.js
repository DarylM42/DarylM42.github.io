const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Connects to MongoDB and registers Trip model
require('../app_api/models/db');

const Trip = mongoose.model('Trip');

function normalizeTrip(raw) {
  const lengthNumber = Number.parseInt(String(raw.length).replace(/[^\d.-]/g, ''), 10);
  const priceNumber = Number.parseFloat(String(raw.price).replace(/[^\d.-]/g, ''));

  return {
    code: raw.code,
    name: raw.name,
    start: new Date(raw.start),
    description: raw.description,
    length: Number.isNaN(lengthNumber) ? 0 : lengthNumber,
    price: Number.isNaN(priceNumber) ? 0 : priceNumber
  };
}

async function seedTrips() {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'trips.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const tripsRaw = JSON.parse(file);

    const trips = tripsRaw.map(normalizeTrip);

    await Trip.deleteMany({});
    const inserted = await Trip.insertMany(trips);

    console.log(`Seed complete: inserted ${inserted.length} trips.`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedTrips();
