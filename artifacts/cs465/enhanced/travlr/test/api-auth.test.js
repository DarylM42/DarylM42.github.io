const assert = require('node:assert/strict');
const test = require('node:test');

const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');

process.env.JWT_SECRET = 'test-secret';

const tripData = {
  _id: 'trip-1',
  code: 'TST001',
  name: 'Test Trip',
  start: '2026-08-01',
  description: 'A test trip',
  length: 3,
  price: 199.99
};

let createdTripPayload;

const tripModel = {
  find: () => ({
    lean: () => ({
      exec: async () => [tripData]
    })
  }),
  findOne: query => ({
    lean: () => ({
      exec: async () => {
        if (query && query.code === tripData.code) {
          return tripData;
        }

        return null;
      }
    }),
    exec: async () => {
      if (query && query.code === tripData.code) {
        return tripData;
      }

      return null;
    }
  }),
  create: async payload => {
    createdTripPayload = payload;

    return {
      _id: 'new-trip',
      ...payload
    };
  },
  findByIdAndUpdate: () => ({
    lean: () => ({
      exec: async () => tripData
    })
  }),
  findOneAndDelete: async () => tripData
};

const originalModel = mongoose.model.bind(mongoose);
mongoose.model = function patchedModel(name, schema, collection, options) {
  if (name === 'Trip' && !schema) {
    return tripModel;
  }

  return originalModel(name, schema, collection, options);
};

const routes = require('../app_api/routes');

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message,
    errors: err.errors || undefined
  });
});

const adminToken = jwt.sign(
  { id: 'admin-id', username: 'admin', role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const userToken = jwt.sign(
  { id: 'user-id', username: 'user', role: 'user' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const expiredToken = jwt.sign(
  {
    id: 'expired-id',
    username: 'expired',
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) - 60
  },
  process.env.JWT_SECRET,
  { noTimestamp: true }
);

test('rejects requests without a bearer token', async () => {
  const response = await request(app).post('/api/trips').send({});

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Authorization header is required');
});

test('rejects expired bearer tokens', async () => {
  const response = await request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${expiredToken}`)
    .send({});

  assert.equal(response.status, 401);
  assert.equal(response.body.message, 'Token has expired');
});

test('rejects authenticated users who are not admins', async () => {
  const response = await request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${userToken}`)
    .send({});

  assert.equal(response.status, 403);
  assert.equal(response.body.message, 'You do not have permission to perform this action');
});

test('rejects invalid trip payloads for admin requests', async () => {
  const response = await request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      code: '',
      name: '',
      start: 'not-a-date',
      description: '',
      length: 0,
      price: -10
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, 'Trip validation failed');
  assert.ok(Array.isArray(response.body.errors));
  assert.ok(response.body.errors.length >= 1);
});

test('allows valid admin trip creation requests', async () => {
  createdTripPayload = undefined;

  const response = await request(app)
    .post('/api/trips')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      code: 'TST002',
      name: 'Created Trip',
      start: '2026-08-15',
      description: 'Created by an admin',
      length: 5,
      price: 299.99
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.code, 'TST002');
  assert.deepEqual(createdTripPayload, {
    code: 'TST002',
    name: 'Created Trip',
    start: '2026-08-15',
    description: 'Created by an admin',
    length: 5,
    price: 299.99
  });
});