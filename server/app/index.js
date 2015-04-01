var util = require('util'),
  async = require('async'),
  express = require('express'),
  mongoose = require('mongoose'),
  config = require('./config'),
  app = express(),
  sensorManager = require('./sensorManager'),
  readingController = require('./controllers/reading'),
  server,
  db = mongoose.connection;

var EXIT_DB_ERROR = 1;

// Setup routes
require('./routes/reading')(app);
require('./routes/static')(app);

async.series([
  function (callback) {
    mongoose.connect(config.MONGO_DB_URL);

    db.on('error', function (err) {
      console.error('connection error:', err);
      process.exit(EXIT_DB_ERROR);
    });

    db.once('open', function () {
      console.log('connected to mongoose db');
      callback();
    });
  },
  function (callback) {
    server = app.listen(config.LISTEN_PORT, config.LISTEN_ADDR, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log('greenhouse server listening on http://%s:%s', host, port);
      callback();
    });
  },
  function () {
    // Start monitoring sensor
    sensorManager.monitorReadings(function (reading) {
      // For each readings read from the sensor, add them in DB
      readingController.addReading(reading);
    });
  }
]);

module.exports = app;
