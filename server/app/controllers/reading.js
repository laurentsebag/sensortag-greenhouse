var readings = require('../models/reading');

exports.getAllReadings = function (callback) {
  callback(null, readings);
};

exports.addReading = function (reading, callback) {
  var values,
    key;

  for (key in readings) {
    if (readings.hasOwnProperty(key) && reading.hasOwnProperty(key)) {
      values = readings[key];
      values.push(reading[key]);
    }
  }

  if (callback) {
    callback(null);
  }
};
