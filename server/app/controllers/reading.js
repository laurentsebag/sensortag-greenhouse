var mongoose = require('mongoose'),
    Promise = mongoose.Promise,
    Reading = mongoose.model('Reading');

exports.getAllReadings = function (callback) {
  var readings = {};

  //TODO see if we can do this directly via mongoose/mongo
  Reading.find({type: Reading.TYPE_LUMINOSITY})
    .lean()
    .exec()
    .then(function (luminosity) {
      readings.luminosity = luminosity;
      return Reading.find({type: Reading.TYPE_TEMP_IR})
        .lean()
        .exec();
    }).then(function (irTemp) {
      readings.irTemperature = irTemp;
      return Reading.find({type: Reading.TYPE_TEMP_AMBIENT})
        .lean()
        .exec();
    }).then(function (ambientTemp) {
      readings.ambientTemperature = ambientTemp;
      return Reading.find({type: Reading.TYPE_HUMIDITY})
        .lean()
        .exec();
    }).then (function (humidity) {
      readings.humidity = humidity;
      return Reading.find({type: Reading.TYPE_PRESSURE})
        .lean()
        .exec();
    }).then (function (pressure) {
      readings.pressure = pressure;
      callback(null, readings);
    }, function (err) {
      callback(err);
    }).end();
};

exports.addReadings = function (readings, callback) {
  var values,
    key,
    reading,
    promise = new Promise(),
    savePromise = function (reading) {
      return reading.promiseSave();
    };

  for (key in readings) {
    if (readings.hasOwnProperty(key)) {
      reading = new Reading({
        date: readings[key].date,
        value: readings[key].value,
        type: key
      });
      promise = promise.then(savePromise(reading));
    }
  }

  promise.then(function () {
    callback(null);
  }, function (err) {
    callback(err);
  });
  promise.fulfill();
};
