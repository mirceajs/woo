'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const test = require('tape');
const request = require('supertest');
const app = require('../../server');
const { cleanup } = require('./helper');
const Device = mongoose.model('Device');

test('Clean up', cleanup);

test('no Device Name - should respond with errors', t => {
  request(app)
  .post('/devices')
  .field('DeviceID', '03x30')
  .field('BatteryStatus', '90%')
  .field('Longitude',3.123)
  .field('Latitude', 12.34)
  .expect('Content-Type', /html/)
  .expect(200)
  .expect(/Device content can not be empty/)
  .end(async err => {
    const count = await Device.count().exec();
    t.ifError(err);
    t.same(count, 0, 'count of devices should be 0');
    t.end();
  });
});


test('valid regiser - should redirect to /', t => {
  request(app)
  .post('/devices')
  .field('DeviceID', '03x30')
  .field('DeviceName', 'Samsung')
  .field('BatteryStatus', '90%')
  .field('Longitude', 3.123)
  .field('Latitude', 12.34)
  .expect('Content-Type', /plain/)
  .expect('Location', /\//)
  .expect(302)
  .end(async err => {
    const count = await Device.count().exec();
    const device = await Device.findOne({ DeviceID: '03x30' }).exec();
    t.ifError(err);
    t.same(count, 1, 'count of Devices should be 1');
    t.same(device.DeviceName, 'Samsung');
    t.end();
  });
});


