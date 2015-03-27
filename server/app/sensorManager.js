var sensortag = require('sensorTag'),
  async = require('async'),
  config = require('./config'),
  SENSOR_SETUP_DELAY = config.SENSOR_SETUP_DELAY,
  SENSOR_READ_DELAY = config.SENSOR_READ_DELAY,
  SENSOR_RECONNECTION_DELAY = config.SENSOR_RECONNECTION_DELAY;

var connect = function (onConnection, onDisconnection, onNewReading) {
  var connected = false,
    readSensor = function (sensorTag) {
      var reading = {};
      console.log("reading sensortag...");
      async.series([
        function(callback) {
          console.log('\tenableIrTemperature');
          sensorTag.enableIrTemperature(callback);
        },
        function(callback) {
          setTimeout(callback, SENSOR_SETUP_DELAY);
        },
        function(callback) {
          console.log('\treadIrTemperature');
          sensorTag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
            var irTemperature = objectTemperature.toFixed(1);
            var temperature = ambientTemperature.toFixed(1);
            console.log('\t\tobject temperature = %d °C', irTemperature);
            console.log('\t\tambient temperature = %d °C', temperature);
            reading.irTemperature = {
              date: new Date(),
              value: irTemperature
            };
            reading.ambientTemperature = {
              date: new Date(),
              value: temperature
            };
            callback();
          });
        },
        function(callback) {
          console.log('\tdisableIrTemperature');
          sensorTag.disableIrTemperature(callback);
        },
        function(callback) {
          console.log('\tenableHumidity');
          sensorTag.enableHumidity(callback);
        },
        function(callback) {
          setTimeout(callback, SENSOR_SETUP_DELAY);
        },
        function(callback) {
          console.log('\treadHumidity');
          sensorTag.readHumidity(function(error, temperature, humidity) {
            console.log('\t\ttemperature = %d °C', temperature.toFixed(1));
            console.log('\t\thumidity = %d %', humidity.toFixed(1));

            reading.humidity = {
              date: new Date(),
              value: humidity
            };
            callback();
          });
        },
        function(callback) {
          console.log('\tdisableHumidity');
          sensorTag.disableHumidity(callback);
        },
        function(callback) {
          console.log('\tenableBarometricPressure');
          sensorTag.enableBarometricPressure(callback);
        },
        function(callback) {
          setTimeout(callback, SENSOR_SETUP_DELAY);
        },
        function(callback) {
          console.log('\treadBarometricPressure');
          sensorTag.readBarometricPressure(function(error, pressure) {
            console.log('\t\tpressure = %d mBar', pressure.toFixed(1));
            reading.pressure = {
              date: new Date(),
              value: pressure.toFixed(1)
            };
            callback();
          });
        },
        function(callback) {
          console.log('\tdisableBarometricPressure');
          sensorTag.disableBarometricPressure(callback);
        },
        function(callback) {
          if (sensorTag.type === 'cc2650') {
            async.series([
              function(callback) {
                console.log('\tenableLuxometer');
                sensorTag.enableLuxometer(callback);
              },
              function(callback) {
                setTimeout(callback, SENSOR_SETUP_DELAY);
              },
              function(callback) {
                console.log('\treadLuxometer');
                sensorTag.readLuxometer(function(error, lux) {
                  console.log('\tlux = %d', lux.toFixed(1));
                  reading.luminosity = {
                    date: new Date(),
                    value: lux.toFixed(1)
                  };
                  callback();
                });
              },
              function(callback) {
                console.log('\tdisableLuxometer');
                sensorTag.disableLuxometer(callback);
              },
              function() {
                onNewReading(reading);
                callback();
              }
            ]);
          }
        },
        function(callback) {
          console.log('reading finished. next readings in %ss', SENSOR_READ_DELAY / 1000);
          setTimeout(function () {
            readSensor(sensorTag);
          }, SENSOR_READ_DELAY);
        }
      ]);
    };

  sensortag.discover(function(sensorTag) {
    console.log('discovered: ' + sensorTag);

    sensorTag.on('disconnect', function () {
      connected = false;
      onDisconnection();
    });

    sensorTag.connectAndSetUp(function () {
      onConnection(sensorTag);
      readSensor(sensorTag);
    });
  });
};

exports.monitorReadings = function (onNewReading) {
  console.log('starting discovery...');

  var onConnection = function (sensor) {
    console.log('connected to ' + sensor);
  },
  onDisconnection = function () {
    console.log('disconnected, attempting new connection in %sms', SENSOR_RECONNECTION_DELAY);
    setTimeout(function () {
      connect(onConnection, onDisconnection, onNewReading);
    }, 5000);
  };

  connect(onConnection, onDisconnection, onNewReading);
};
