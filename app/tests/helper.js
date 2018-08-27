'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Device = mongoose.model('Device');

const co = require('co');

/**
 * Clear database
 *
 * @param {Object} t<Ava>
 * @api public
 */

exports.cleanup = function (t) {
  co(function* () {
    yield Device.remove();
    t.end();
  });
};
