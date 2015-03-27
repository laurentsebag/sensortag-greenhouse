var util = require('util'),
  async = require('async'),
  sensortag = require('sensortag'),
  express = require('express'),
  config = require('./config'),
  app = express(),
  sensorManager = require('./sensorManager'),
  readingController = require('./controllers/reading'),
  server;

server = app.listen(config.LISTEN_PORT, config.LISTEN_ADDR, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Greenhouse server listening on http://%s:%s', host, port);
});

// Setup routes
require('./routes/reading')(app);
require('./routes/static')(app);

// Start monitoring sensor
sensorManager.monitorReadings(function (reading) {
  readingController.addReading(reading);
});

module.exports = app;
