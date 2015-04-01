var mongoose = require('mongoose'),
    Promise = mongoose.Promise,
    Reading = mongoose.model('Reading');

exports.getAllReadings = function (options, callback) {
  var readings = {},
    findReadings = function () {
      Reading.find({type: Reading.TYPE_LUMINOSITY})
        .select(Reading.PUBLIC_SELECTION)
        .lean()
        .exec()
        .then(function (luminosity) {
          readings[Reading.TYPE_LUMINOSITY] = luminosity;
          return Reading.find({type: Reading.TYPE_TEMP_IR})
            .select(Reading.PUBLIC_SELECTION)
            .lean()
            .exec();
        }).then(function (irTemp) {
          readings[Reading.TYPE_TEMP_IR] = irTemp;
          return Reading.find({type: Reading.TYPE_TEMP_AMBIENT})
            .select(Reading.PUBLIC_SELECTION)
            .lean()
            .exec();
        }).then(function (ambientTemp) {
          readings[Reading.TYPE_TEMP_AMBIENT] = ambientTemp;
          return Reading.find({type: Reading.TYPE_HUMIDITY})
            .select(Reading.PUBLIC_SELECTION)
            .lean()
            .exec();
        }).then (function (humidity) {
          readings[Reading.TYPE_HUMIDITY] = humidity;
          return Reading.find({type: Reading.TYPE_PRESSURE})
            .select(Reading.PUBLIC_SELECTION)
            .lean()
            .exec();
        }).then (function (pressure) {
          readings[Reading.TYPE_PRESSURE] = pressure;
          callback(null, readings);
        }, function (err) {
          callback(err);
        }).end();
    };

  if (options && options.since) {
    Reading.count().where('date').gt(options.since).exec(function (count) {
      if (count <= 0) {
        callback(null, null);
      } else {
        findReadings();
      }
    }, function (err) {
      callback(err);
    });
  } else {
    findReadings();
  }

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
